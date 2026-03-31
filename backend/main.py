import pandas as pd
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import LabelEncoder, MinMaxScaler, StandardScaler
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier

app = FastAPI()

# React'ın backend'e erişebilmesi için CORS ayarı
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- STEP 1: DOMAINS ---
@app.get("/domains")
def get_clinical_domains():
    return {
        "status": "success",
        "data": [
            {
                "id": 1,
                "specialty": "Cardiology",
                "clinical_question": "Predict 30-day readmission risk after heart failure discharge.",
                "dataset_source": "UCI Heart Failure Clinical Records",
            },
            {
                "id": 2,
                "specialty": "Oncology",
                "clinical_question": "Predict breast cancer malignancy from biopsy.",
                "dataset_source": "Wisconsin Breast Cancer Dataset",
            },
        ],
    }


# --- STEP 2: DATA EXPLORATION (CSV YÜKLEME) ---
@app.post("/dataset/load")
async def load_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=400, detail="Only CSV files can be uploaded."
        )

    try:
        df = pd.read_csv(file.file)

        # Temel Doğrulamalar
        if len(df) < 10:
            return {
                "status": "error",
                "message": "Dataset must contain at least 10 patients.",
            }

        numeric_columns = df.select_dtypes(include=["number"]).columns
        if len(numeric_columns) < 1:
            return {
                "status": "error",
                "message": "At least one numeric measurement column is required.",
            }

        # JSON formatına uygun tipleri çeviriyoruz
        column_types = {col: str(dtype) for col, dtype in df.dtypes.items()}
        missing_values = df.isnull().sum().to_dict()

        return {
            "status": "success",
            "filename": file.filename,
            "dataset_summary": {
                "total_patients": len(df),
                "total_measurements": len(df.columns),
            },
            "columns": list(df.columns),
            "columns_info": {
                "missing_data_count": missing_values,
                "data_types": column_types,
            },
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


# --- STEP 3: DATA PREPARATION (GERÇEK VERİLER) ---
@app.post("/preprocess")
async def preprocess_data(
    file: UploadFile = File(...),
    target_column: str = Form(...),
    test_size: float = Form(0.2),
    missing_strategy: str = Form("median"),
    normalization: str = Form("z-score"),
):
    try:
        df = pd.read_csv(file.file)

        # Step 3 ekranında göstermek için ilk sayısal sütunu buluyoruz (Örn: Yaş, Kilo, Şeker)
        numeric_cols = df.select_dtypes(include=["number"]).columns.tolist()
        if target_column in numeric_cols:
            numeric_cols.remove(target_column)

        if len(numeric_cols) == 0:
            return {
                "status": "error",
                "message": "No numeric columns found in dataset.",
            }

        sample_col = numeric_cols[0]  # Gösterge için ilk sütunu seç

        # Normalizasyon Öncesi Değerler
        before_min = df[sample_col].min()
        before_mean = df[sample_col].mean()
        before_max = df[sample_col].max()

        # Temizleme ve Normalizasyon İşlemi
        imputer = SimpleImputer(strategy=missing_strategy)
        df[sample_col] = imputer.fit_transform(df[[sample_col]])

        if normalization == "z-score":
            scaler = StandardScaler()
        else:
            scaler = MinMaxScaler()

        scaled_vals = scaler.fit_transform(df[[sample_col]])

        # Normalizasyon Sonrası Değerler
        after_min = scaled_vals.min()
        after_mean = scaled_vals.mean()
        after_max = scaled_vals.max()

        # Hasta Sayılarını Bölme
        total = len(df)
        test_count = int(total * test_size)
        train_count = total - test_count

        return {
            "status": "success",
            "train_patients": int(train_count),
            "test_patients": int(test_count),
            "before": {
                "min": round(float(before_min), 2),
                "mean": round(float(before_mean), 2),
                "max": round(float(before_max), 2),
            },
            "after": {
                "min": round(float(after_min), 2),
                "mean": round(float(after_mean), 2),
                "max": round(float(after_max), 2),
            },
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}



# --- STEP 4 & 5: MODEL TRAINING ---
@app.post("/train")
async def train_model(
    file: UploadFile = File(...),
    target_column: str = Form(...),
    algorithm: str = Form("knn"),
    knn_k: int = Form(5),
    knn_distance: str = Form("euclidean"), 
    test_size: float = Form(0.2),
):
    try:
        df = pd.read_csv(file.file)
        if target_column not in df.columns:
            return {"status": "error", "message": "Target column not found."}

        X = df.drop(columns=[target_column])
        y = df[target_column]

        # Target column validation: too many unique values = likely continuous/regression
        n_unique = y.nunique()
        n_samples = len(y)
        if n_unique > n_samples * 0.5:
            return {
                "status": "error",
                "message": f"Target column '{target_column}' has {n_unique} unique values out of {n_samples} samples. "
                           f"This looks like a continuous variable, not a classification target. "
                           f"Please select a column with fewer categories (e.g., 0/1, Yes/No).",
            }

        if n_unique < 2:
            return {
                "status": "error",
                "message": f"Target column '{target_column}' has only {n_unique} unique value(s). "
                           f"Classification requires at least 2 distinct classes.",
            }

        numeric_cols = X.select_dtypes(include=["number"]).columns
        X_numeric = X[numeric_cols].copy()

        if len(X_numeric.columns) == 0:
            return {"status": "error", "message": "No numeric feature columns found for training."}

        imputer = SimpleImputer(strategy="median")
        X_imputed = imputer.fit_transform(X_numeric)

        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X_imputed)

        le = LabelEncoder()
        y_encoded = le.fit_transform(y)

        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y_encoded, test_size=test_size, random_state=42
        )

        if algorithm == "knn":
            k = min(knn_k, max(1, len(X_train) - 1))
            model = KNeighborsClassifier(n_neighbors=k, metric=knn_distance)
        elif algorithm == "svm":
            model = SVC(probability=True, random_state=42)
        elif algorithm == "dt":
            model = DecisionTreeClassifier(random_state=42)
        elif algorithm == "rf":
            model = RandomForestClassifier(random_state=42)
        elif algorithm == "lr":
            model = LogisticRegression(random_state=42, max_iter=1000)
        elif algorithm == "nb":
            model = GaussianNB()
        else:
            return {"status": "error", "message": "Invalid model type."}

        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average="weighted", zero_division=0)
        f1 = f1_score(y_test, y_pred, average="weighted", zero_division=0)

        try:
            if len(set(y_encoded)) > 2:
                y_prob = model.predict_proba(X_test)
                auc = roc_auc_score(y_test, y_prob, multi_class="ovr")
            else:
                y_prob = model.predict_proba(X_test)[:, 1]
                auc = roc_auc_score(y_test, y_prob)
        except:
            auc = 0.0

        cm = confusion_matrix(y_test, y_pred)

        if cm.size == 4:
            tn, fp, fn, tp = cm.ravel()
            sensitivity = tp / (tp + fn) if (tp + fn) > 0 else 0
            specificity = tn / (tn + fp) if (tn + fp) > 0 else 0
        else:
            tn, fp, fn, tp = 0, 0, 0, len(y_test)
            sensitivity = acc
            specificity = acc

        return {
            "status": "success",
            "model_used": algorithm,
            "metrics": {
                "accuracy": round(acc * 100),
                "sensitivity": round(sensitivity * 100),
                "specificity": round(specificity * 100),
                "precision": round(prec * 100),
                "f1_score": round(f1 * 100),
                "auc": round(auc, 2),
            },
            "confusion_matrix": {
                "tn": int(tn),
                "fp": int(fp),
                "fn": int(fn),
                "tp": int(tp),
            },
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}


# --- STEP 6: EXPLAINABILITY ---
@app.post("/explain")
async def explain_model(
    file: UploadFile = File(...),
    target_column: str = Form(...),
    test_size: float = Form(0.2),
    patient_index: int = Form(None),
):
    try:
        df = pd.read_csv(file.file)
        if target_column not in df.columns:
            return {"status": "error", "message": "Target column not found."}

        X = df.drop(columns=[target_column])
        y = df[target_column]

        numeric_cols = X.select_dtypes(include=["number"]).columns.tolist()
        X_numeric = X[numeric_cols].copy()

        if len(X_numeric.columns) == 0:
            return {"status": "error", "message": "No numeric features found."}

        imputer = SimpleImputer(strategy="median")
        X_imputed = pd.DataFrame(imputer.fit_transform(X_numeric), columns=numeric_cols)

        scaler = StandardScaler()
        X_scaled = pd.DataFrame(scaler.fit_transform(X_imputed), columns=numeric_cols)

        le = LabelEncoder()
        y_encoded = le.fit_transform(y)

        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y_encoded, test_size=test_size, random_state=42
        )

        rf = RandomForestClassifier(n_estimators=100, random_state=42)
        rf.fit(X_train, y_train)

        importances = rf.feature_importances_
        feature_importance = []
        for col, imp in sorted(zip(numeric_cols, importances), key=lambda x: -x[1]):
            feature_importance.append({"feature": col, "importance": round(float(imp), 4)})

        y_prob_all = rf.predict_proba(X_test)
        if y_prob_all.shape[1] >= 2:
            risk_scores = y_prob_all[:, 1]
        else:
            risk_scores = y_prob_all[:, 0]

        # Use explicitly provided patient_index, else use the highest risk patient
        if patient_index is not None and patient_index in X_test.index:
            target_idx = patient_index
            iloc_idx = list(X_test.index).index(target_idx)
        else:
            iloc_idx = int(risk_scores.argmax())
            target_idx = X_test.index[iloc_idx]
            
        patient_data = X_test.iloc[iloc_idx]
        patient_risk = round(float(risk_scores[iloc_idx]) * 100)

        patient_contributions = []
        for col, imp in zip(numeric_cols, importances):
            val = float(patient_data[col])
            mean_val = float(X_train[col].mean())
            deviation = val - mean_val
            contribution = round(float(deviation * imp), 4)
            original_val = float(X_imputed.iloc[iloc_idx][col])
            
            # Simulated partial dependency for "what-if"
            what_if_effect = round(contribution * -0.5, 4)
            
            patient_contributions.append({
                "feature": col,
                "value": round(original_val, 2),
                "contribution": contribution,
                "direction": "risk" if contribution > 0 else "protective",
                "what_if_effect": what_if_effect
            })

        patient_contributions.sort(key=lambda x: abs(x["contribution"]), reverse=True)

        # Multi-patient list for dropdown (top 15)
        test_patients = []
        for i in range(min(15, len(X_test))):
            risk = round(float(risk_scores[i]) * 100)
            idx = int(X_test.index[i])
            test_patients.append({
                "patient_index": idx,
                "label": f"Patient #{idx} (Risk: {risk}%)",
                "risk": risk,
            })

        return {
            "status": "success",
            "feature_importance": feature_importance[:10],
            "patient_explanation": {
                "patient_index": int(target_idx),
                "risk_percent": patient_risk,
                "contributions": patient_contributions[:6],
            },
            "test_patients": test_patients,
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}

