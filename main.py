import pandas as pd
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler, StandardScaler

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
            status_code=400, detail="Sadece CSV dosyaları yüklenebilir."
        )

    try:
        df = pd.read_csv(file.file)

        # Temel Doğrulamalar
        if len(df) < 10:
            return {
                "status": "error",
                "message": "Veri seti en az 10 hasta içermelidir.",
            }

        numeric_columns = df.select_dtypes(include=["number"]).columns
        if len(numeric_columns) < 1:
            return {
                "status": "error",
                "message": "En az bir sayısal ölçüm bulunmalıdır.",
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


# --- STEP 3: DATA PREPARATION (VERİ TEMİZLEME) ---
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

        if target_column not in df.columns:
            return {
                "status": "error",
                "message": f"Hedef sütun '{target_column}' bulunamadı!",
            }

        # X (Özellikler) ve y (Hedef) olarak ayır
        X = df.drop(columns=[target_column])
        y = df[target_column]

        # Sadece sayısal sütunlarla işlem yapıyoruz
        numeric_cols = X.select_dtypes(include=["number"]).columns
        X_numeric = X[numeric_cols].copy()

        if len(numeric_cols) == 0:
            return {"status": "error", "message": "İşlenecek sayısal sütun bulunamadı."}

        # 1. Eksik Veri Doldurma
        strategy = "median" if missing_strategy == "median" else "most_frequent"
        imputer = SimpleImputer(strategy=strategy)
        X_imputed = pd.DataFrame(imputer.fit_transform(X_numeric), columns=numeric_cols)

        # Before (Öncesi) İstatistikleri
        before_stats = {
            "min": round(X_imputed.iloc[:, 0].min(), 2),
            "max": round(X_imputed.iloc[:, 0].max(), 2),
            "mean": round(X_imputed.iloc[:, 0].mean(), 2),
            "sample_col": numeric_cols[
                0
            ],  # Örnek olarak ilk sütunun grafiğini çizeceğiz
        }

        # 2. Normalizasyon
        scaler = StandardScaler() if normalization == "z-score" else MinMaxScaler()
        X_scaled = pd.DataFrame(scaler.fit_transform(X_imputed), columns=numeric_cols)

        # After (Sonrası) İstatistikleri
        after_stats = {
            "min": round(X_scaled.iloc[:, 0].min(), 2),
            "max": round(X_scaled.iloc[:, 0].max(), 2),
            "mean": round(X_scaled.iloc[:, 0].mean(), 2),
        }

        # 3. Veri Bölme (Train/Test)
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=test_size, random_state=42
        )

        return {
            "status": "success",
            "train_patients": len(X_train),
            "test_patients": len(X_test),
            "before": before_stats,
            "after": after_stats,
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}
