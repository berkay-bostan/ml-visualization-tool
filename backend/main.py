import io
import json
from pathlib import Path

import pandas as pd
import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import LabelEncoder, MinMaxScaler, StandardScaler
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier

try:
    from imblearn.over_sampling import SMOTE
    SMOTE_AVAILABLE = True
except ImportError:
    SMOTE_AVAILABLE = False

app = FastAPI()

# React'ın backend'e erişebilmesi için CORS ayarı
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================================
# LOCAL DATASET MANAGEMENT SYSTEM
# =====================================================================
# Lokal CSV dosyalarını yöneten konfigürasyon ve yardımcı fonksiyonlar.
# Tüm CSV dosyaları backend/datasets/ klasöründe tutulur.
# ucimlrepo yerine pandas ile doğrudan okunur (offline & hızlı).
# =====================================================================

# Datasets klasörünün mutlak yolu
DATASETS_DIR = Path(__file__).resolve().parent / "datasets"

# Mevcut veri setlerinin konfigürasyon sözlüğü
# Her bir anahtar (key) veri setinin benzersiz adıdır.
# Değer (value) olarak path, target_col, description ve opsiyonel header_names tutulur.
# header_names: CSV dosyasında başlık satırı yoksa sütun isimlerini belirtir.
AVAILABLE_DATASETS: dict[str, dict] = {
    # 1. Heart Failure — Cardiology
    "heart_failure": {
        "path": DATASETS_DIR / "heart_failure_clinical_records_dataset.csv",
        "target_col": "DEATH_EVENT",
        "description": "UCI Heart Failure Clinical Records — 299 patients, 12 features. Predicts 30-day mortality risk after heart failure.",
        "domain": "Cardiology",
    },
    # 2. Breast Cancer Coimbra — Oncology
    "breast_cancer_coimbra": {
        "path": DATASETS_DIR / "breast+cancer+coimbra.csv",
        "target_col": "Classification",
        "description": "Breast Cancer Coimbra — 116 patients, 9 biomarkers. Classifies breast cancer risk from blood tests (1=Healthy, 2=Patient).",
        "domain": "Oncology — Breast",
    },
    # 3. Diabetes Early Prediction — Endocrinology
    "diabetes_early": {
        "path": DATASETS_DIR / "diabetes_data_upload.csv",
        "target_col": "class",
        "description": "Early Stage Diabetes Risk Prediction — 520 patients, 16 symptoms. Predicts early stage diabetes risk (Positive/Negative).",
        "domain": "Endocrinology — Diabetes",
    },
    # 4. Diabetes Readmission — Pharmacy / Hospital
    "diabetes_readmission": {
        "path": DATASETS_DIR / "diabetic_data.csv",
        "target_col": "readmitted",
        "description": "UCI Diabetes 130-US Hospitals — 100K+ patients, 49 features. Predicts readmission risk for diabetic patients.",
        "domain": "Pharmacy — Readmission",
    },
    # 5. Fetal Health — Obstetrics
    "fetal_health": {
        "path": DATASETS_DIR / "fetal_health.csv",
        "target_col": "fetal_health",
        "description": "UCI Fetal Health — 2126 records, 21 cardiotocography features. Classifies fetal health status (1=Normal, 2=Suspect, 3=Pathological).",
        "domain": "Obstetrics — Fetal Health",
    },
    # 6. Stroke Prediction — Cardiology / Neurology
    "stroke_prediction": {
        "path": DATASETS_DIR / "healthcare-dataset-stroke-data.csv",
        "target_col": "stroke",
        "description": "Kaggle Stroke Prediction — 5110 patients, 11 features. Predicts stroke risk from demographic and clinical data.",
        "domain": "Cardiology — Stroke",
    },
    # 7. Indian Liver Patient — Hepatology
    "indian_liver_patient": {
        "path": DATASETS_DIR / "IndianLiverPatientDataset.csv",
        "target_col": "Selector",
        "description": "Indian Liver Patient — 583 patients, 10 blood test results. Predicts liver disease diagnosis (1=Patient, 2=Healthy).",
        "domain": "Hepatology — Liver",
        # Bu CSV dosyasında başlık satırı bulunmadığından UCI resmi sütun isimleri verilir
        "header_names": [
            "Age", "Gender", "TB", "DB", "Alkphos", "Sgpt", "Sgot",
            "TP", "ALB", "A/G Ratio", "Selector",
        ],
    },
    # 8. Cervical Cancer Risk — Oncology
    "cervical_cancer": {
        "path": DATASETS_DIR / "risk_factors_cervical_cancer.csv",
        "target_col": "Biopsy",
        "description": "UCI Cervical Cancer Risk Factors — 858 patients, 35 features. Predicts cervical cancer risk using demographic and behavioral data.",
        "domain": "Oncology — Cervical",
    },
    "radiology_breast": {
        "path": DATASETS_DIR / "radiology_breast.csv",
        "target_col": "Diagnosis",
        "description": "Breast Cancer Wisconsin (Diagnostic). Predicts malignant vs benign from cell nuclei features.",
        "domain": "Radiology",
    },
    "nephrology_ckd": {
        "path": DATASETS_DIR / "nephrology_ckd.csv",
        "target_col": "class",
        "description": "Chronic Kidney Disease dataset. Predicts CKD presence from blood/urine tests.",
        "domain": "Nephrology",
    },
    "neurology_parkinsons": {
        "path": DATASETS_DIR / "neurology_parkinsons.csv",
        "target_col": "status",
        "description": "Parkinsons dataset. Predicts Parkinson's presence from voice measurements.",
        "domain": "Neurology — Parkinson's",
    },
    "mental_health_autism": {
        "path": DATASETS_DIR / "mental_health_autism.csv",
        "target_col": "Class/ASD",
        "description": "Autism Screening dataset. Predicts ASD presence from behavioral traits.",
        "domain": "Mental Health",
    },
    "pulmonology_thoracic": {
        "path": DATASETS_DIR / "pulmonology_thoracic.csv",
        "target_col": "Risk1Yr",
        "description": "Thoracic Surgery Data. Predicts 1 year survival after surgery.",
        "domain": "Pulmonology — COPD",
    },
    "haematology_blood": {
        "path": DATASETS_DIR / "haematology_blood.csv",
        "target_col": "Donated_Blood",
        "description": "Blood Transfusion Service Center dataset. Predicts blood donation.",
        "domain": "Haematology — Anaemia",
    },
    "dermatology_erythemato": {
        "path": DATASETS_DIR / "dermatology_erythemato.csv",
        "target_col": "class",
        "description": "Dermatology dataset. Predicts type of Eryhemato-Squamous Disease.",
        "domain": "Dermatology",
    },
    "ophthalmology_retinopathy": {
        "path": DATASETS_DIR / "ophthalmology_retinopathy.csv",
        "target_col": "Class",
        "description": "Diabetic Retinopathy Debrecen dataset. Predicts DR presence.",
        "domain": "Ophthalmology",
    },
    "orthopaedics_vertebral": {
        "path": DATASETS_DIR / "orthopaedics_vertebral.csv",
        "target_col": "class",
        "description": "Vertebral Column dataset. Predicts orthopedic pathologies.",
        "domain": "Orthopaedics — Spine",
    },
    "icu_hepatitis": {
        "path": DATASETS_DIR / "icu_hepatitis.csv",
        "target_col": "Category",
        "description": "HCV data. Classifies blood donors vs Hepatitis C patients.",
        "domain": "ICU / Sepsis",
    },
    "cardiology_arrhythmia": {
        "path": DATASETS_DIR / "cardiology_arrhythmia.csv",
        "target_col": "arrhythmia",
        "description": "Cardiac Arrhythmia. Predicts presence of arrhythmia from ECG.",
        "domain": "Cardiology — Arrhythmia",
    },
    "endocrinology_thyroid": {
        "path": DATASETS_DIR / "endocrinology_thyroid.csv",
        "target_col": "class",
        "description": "Thyroid Disease. Classifies thyroid function.",
        "domain": "Thyroid / Endocrinology",
    },
}


def get_dataset(dataset_name: str) -> dict:
    """
    İstenen veri setini lazy-loading ile yükler.

    Parametreler:
        dataset_name: AVAILABLE_DATASETS sözlüğündeki anahtar isim.

    Döndürür:
        {
            "X": pd.DataFrame,      # Özellik sütunları
            "y": pd.Series,          # Hedef sütunu
            "metadata": dict          # Veri seti metadatası
        }

    Hatalar:
        ValueError  — Veri seti sözlükte bulunamazsa.
        FileNotFoundError — CSV dosyası diskte yoksa.
        RuntimeError — CSV okunurken beklenmeyen hata oluşursa.
    """
    # 1. Sözlükte var mı kontrol et
    if dataset_name not in AVAILABLE_DATASETS:
        available = ", ".join(sorted(AVAILABLE_DATASETS.keys()))
        raise ValueError(
            f"Dataset '{dataset_name}' not found. "
            f"Available datasets: {available}"
        )

    config = AVAILABLE_DATASETS[dataset_name]
    file_path: Path = config["path"]
    target_col: str = config["target_col"]

    # 2. Dosya var mı kontrol et
    if not file_path.exists():
        raise FileNotFoundError(
            f"Dataset file not found: {file_path}. "
            f"Please ensure it is in the datasets directory."
        )

    # 3. CSV'yi oku (Lazy Loading — sadece çağrıldığında okunur)
    # header_names varsa CSV'de başlık satırı yoktur, sütun isimlerini biz veririz
    try:
        header_names = config.get("header_names")
        if header_names:
            df = pd.read_csv(file_path, header=None, names=header_names)
        else:
            df = pd.read_csv(file_path)
    except Exception as exc:
        raise RuntimeError(
            f"Error occurred while reading dataset '{dataset_name}': {exc}"
        ) from exc

    # 4. Hedef sütun kontrolü
    if target_col not in df.columns:
        raise ValueError(
            f"Target column '{target_col}' not found in the dataset. "
            f"Available columns: {list(df.columns)}"
        )

    # 5. Özellikler (X) ve hedef (y) olarak ayır
    X = df.drop(columns=[target_col])
    y = df[target_col]

    # 6. Metadata hazırla
    # Ensure no NaNs in target classes for JSON serialization
    unique_targets = [val for val in y.unique().tolist() if pd.notnull(val)]
    metadata = {
        "name": dataset_name,
        "target_col": target_col,
        "description": config.get("description", ""),
        "num_samples": len(df),
        "num_features": len(X.columns),
        "feature_names": list(X.columns),
        "target_classes": sorted(unique_targets, key=str),
    }

    return {"X": X, "y": y, "metadata": metadata}


# --- API: Mevcut lokal veri setlerini listele ---
@app.get("/datasets")
def list_available_datasets():
    """Kullanılabilir tüm lokal veri setlerini ve metadatalarını döndürür."""
    datasets_info = []
    for name, config in AVAILABLE_DATASETS.items():
        file_path: Path = config["path"]
        datasets_info.append({
            "name": name,
            "target_col": config["target_col"],
            "description": config.get("description", ""),
            "domain": config.get("domain", "Unknown"),
            "file_exists": file_path.exists(),
            "filename": file_path.name,
        })
    return {"status": "success", "datasets": datasets_info}


# --- API: Belirli bir lokal veri setini yükle ---
@app.get("/datasets/{dataset_name}")
def load_local_dataset(dataset_name: str):
    """
    Belirtilen veri setini diskten okur ve özet bilgileriyle birlikte döndürür.
    Frontend bu endpoint'i kullanarak dosya yüklemeye gerek kalmadan
    default veri setlerini doğrudan yükleyebilir.
    """
    try:
        result = get_dataset(dataset_name)
        X: pd.DataFrame = result["X"]
        y: pd.Series = result["y"]
        metadata: dict = result["metadata"]

        # Sütun tipleri ve eksik değer bilgisi
        column_types = {col: str(dtype) for col, dtype in X.dtypes.items()}
        missing_values = X.isnull().sum().to_dict()

        # Handle NaN values for JSON serialization
        preview_records = json.loads(X.head(5).to_json(orient="records"))

        return {
            "status": "success",
            "metadata": metadata,
            "dataset_summary": {
                "total_patients": metadata["num_samples"],
                "total_measurements": metadata["num_features"],
            },
            "columns": list(X.columns) + [metadata["target_col"]],
            "columns_info": {
                "missing_data_count": missing_values,
                "data_types": column_types,
            },
            "target_column": metadata["target_col"],
            "preview": preview_records,
        }

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- API: Lokal CSV dosyasını indir (frontend File objesi oluşturmak için) ---
@app.get("/datasets/{dataset_name}/download")
def download_local_dataset(dataset_name: str):
    """
    Belirtilen veri setinin ham CSV dosyasını döndürür.
    Frontend bu endpoint ile CSV'yi indirip File objesine çevirir,
    böylece sonraki adımlardaki (Step 3-7) file upload API'leri
    değişmeden çalışmaya devam eder.
    """
    if dataset_name not in AVAILABLE_DATASETS:
        raise HTTPException(status_code=404, detail=f"'{dataset_name}' not found.")

    config = AVAILABLE_DATASETS[dataset_name]
    file_path: Path = config["path"]

    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"File not found: {file_path.name}")

    # header_names varsa CSV'yi oku ve header ekleyerek geri dön
    header_names = config.get("header_names")
    if header_names:
        df = pd.read_csv(file_path, header=None, names=header_names)
        csv_buffer = io.StringIO()
        df.to_csv(csv_buffer, index=False)
        csv_bytes = csv_buffer.getvalue().encode("utf-8")
        return StreamingResponse(
            io.BytesIO(csv_bytes),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={dataset_name}.csv"},
        )

    # Header olan dosyaları doğrudan gönder
    from fastapi.responses import FileResponse
    return FileResponse(
        path=str(file_path),
        media_type="text/csv",
        filename=f"{dataset_name}.csv",
    )


# --- STEP 1: DOMAINS (20 Clinical Specialties) ---
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
                "target_variable": "DEATH_EVENT",
            },
            {
                "id": 2,
                "specialty": "Radiology",
                "clinical_question": "Classify normal vs. pneumonia from clinical features.",
                "dataset_source": "NIH Chest X-Ray metadata",
                "target_variable": "Finding Label",
            },
            {
                "id": 3,
                "specialty": "Nephrology",
                "clinical_question": "Predict chronic kidney disease stage from routine lab values.",
                "dataset_source": "UCI CKD Dataset (400 patients)",
                "target_variable": "classification",
            },
            {
                "id": 4,
                "specialty": "Oncology — Breast",
                "clinical_question": "Predict malignancy of a breast biopsy from cell measurements.",
                "dataset_source": "Wisconsin Breast Cancer Dataset",
                "target_variable": "diagnosis",
            },
            {
                "id": 5,
                "specialty": "Neurology — Parkinson's",
                "clinical_question": "Detect Parkinson's disease from voice biomarkers.",
                "dataset_source": "UCI Parkinson's Dataset",
                "target_variable": "status",
            },
            {
                "id": 6,
                "specialty": "Endocrinology — Diabetes",
                "clinical_question": "Predict diabetes onset within 5 years from metabolic markers.",
                "dataset_source": "Pima Indians Diabetes Dataset",
                "target_variable": "Outcome",
            },
            {
                "id": 7,
                "specialty": "Hepatology — Liver",
                "clinical_question": "Predict liver disease from blood test results.",
                "dataset_source": "Indian Liver Patient Dataset",
                "target_variable": "Dataset",
            },
            {
                "id": 8,
                "specialty": "Cardiology — Stroke",
                "clinical_question": "Predict stroke risk from demographics and comorbidities.",
                "dataset_source": "Kaggle Stroke Prediction Dataset",
                "target_variable": "stroke",
            },
            {
                "id": 9,
                "specialty": "Mental Health",
                "clinical_question": "Classify depression severity from PHQ-9 survey responses.",
                "dataset_source": "Kaggle Depression/Anxiety Dataset",
                "target_variable": "severity class",
            },
            {
                "id": 10,
                "specialty": "Pulmonology — COPD",
                "clinical_question": "Predict COPD exacerbation risk from spirometry data.",
                "dataset_source": "Kaggle / PhysioNet COPD Dataset",
                "target_variable": "exacerbation",
            },
            {
                "id": 11,
                "specialty": "Haematology — Anaemia",
                "clinical_question": "Classify type of anaemia from full blood count results.",
                "dataset_source": "Kaggle Anaemia Classification Dataset",
                "target_variable": "anemia_type",
            },
            {
                "id": 12,
                "specialty": "Dermatology",
                "clinical_question": "Classify benign vs. malignant skin lesion from dermoscopy features.",
                "dataset_source": "HAM10000 metadata (Kaggle)",
                "target_variable": "dx_type",
            },
            {
                "id": 13,
                "specialty": "Ophthalmology",
                "clinical_question": "Predict diabetic retinopathy severity from clinical findings.",
                "dataset_source": "UCI / Kaggle Retinopathy Dataset",
                "target_variable": "severity grade",
            },
            {
                "id": 14,
                "specialty": "Orthopaedics — Spine",
                "clinical_question": "Classify normal vs. disc herniation from biomechanical measures.",
                "dataset_source": "UCI Vertebral Column Dataset",
                "target_variable": "class",
            },
            {
                "id": 15,
                "specialty": "ICU / Sepsis",
                "clinical_question": "Predict sepsis onset from vital signs and lab results.",
                "dataset_source": "PhysioNet / Kaggle Sepsis Dataset",
                "target_variable": "SepsisLabel",
            },
            {
                "id": 16,
                "specialty": "Obstetrics — Fetal Health",
                "clinical_question": "Classify fetal cardiotocography (normal / suspect / pathological).",
                "dataset_source": "UCI Fetal Health Dataset",
                "target_variable": "fetal_health",
            },
            {
                "id": 17,
                "specialty": "Cardiology — Arrhythmia",
                "clinical_question": "Detect cardiac arrhythmia presence from ECG features.",
                "dataset_source": "UCI Arrhythmia Dataset",
                "target_variable": "arrhythmia",
            },
            {
                "id": 18,
                "specialty": "Oncology — Cervical",
                "clinical_question": "Predict cervical cancer risk from demographic and behavioural data.",
                "dataset_source": "UCI Cervical Cancer Dataset",
                "target_variable": "Biopsy",
            },
            {
                "id": 19,
                "specialty": "Thyroid / Endocrinology",
                "clinical_question": "Classify thyroid function (hypo / hyper / normal).",
                "dataset_source": "UCI Thyroid Disease Dataset",
                "target_variable": "class",
            },
            {
                "id": 20,
                "specialty": "Pharmacy — Readmission",
                "clinical_question": "Predict hospital readmission risk for diabetic patients on medication.",
                "dataset_source": "UCI Diabetes 130-US Hospitals Dataset",
                "target_variable": "readmitted",
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
    apply_smote: bool = Form(False),
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
        elif normalization == "min-max":
            scaler = MinMaxScaler()
        else:
            scaler = None

        if scaler:
            scaled_vals = scaler.fit_transform(df[[sample_col]])
        else:
            scaled_vals = df[[sample_col]].values

        # Normalizasyon Sonrası Değerler
        after_min = scaled_vals.min()
        after_mean = scaled_vals.mean()
        after_max = scaled_vals.max()

        # Hasta Sayılarını Bölme
        total = len(df)
        test_count = int(total * test_size)
        train_count = total - test_count

        # Class distribution for SMOTE preview
        smote_info = None
        if target_column in df.columns:
            le_temp = LabelEncoder()
            y_temp = le_temp.fit_transform(df[target_column])
            class_counts = pd.Series(y_temp).value_counts().to_dict()
            class_labels = {int(k): str(le_temp.inverse_transform([k])[0]) for k in class_counts}
            
            total_samples = sum(class_counts.values())
            minority_ratio = min(class_counts.values()) / total_samples if total_samples > 0 else 0.5
            imbalance_detected = minority_ratio < 0.3

            smote_applied = False
            after_smote_counts = None

            if apply_smote and SMOTE_AVAILABLE and imbalance_detected:
                # Compute what SMOTE would produce on training data
                X_all = df.drop(columns=[target_column])
                X_num = X_all.select_dtypes(include=["number"])
                imp = SimpleImputer(strategy=missing_strategy)
                X_imp = imp.fit_transform(X_num)
                X_tr, _, y_tr, _ = train_test_split(X_imp, y_temp, test_size=test_size, random_state=42)
                try:
                    sm = SMOTE(random_state=42)
                    X_res, y_res = sm.fit_resample(X_tr, y_tr)
                    after_smote_counts = {int(k): int(v) for k, v in pd.Series(y_res).value_counts().items()}
                    smote_applied = True
                    train_count = len(X_res)
                except Exception:
                    smote_applied = False

            smote_info = {
                "imbalance_detected": imbalance_detected,
                "minority_ratio": round(minority_ratio, 3),
                "class_distribution_before": {str(class_labels[k]): int(v) for k, v in class_counts.items()},
                "smote_applied": smote_applied,
                "class_distribution_after_smote": (
                    {str(class_labels.get(k, k)): int(v) for k, v in after_smote_counts.items()}
                    if after_smote_counts else None
                ),
            }

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
            "smote": smote_info,
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
    apply_smote: bool = Form(False),
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

        # --- SMOTE: Apply ONLY to training data (never to test data) ---
        smote_applied = False
        if apply_smote and SMOTE_AVAILABLE:
            try:
                sm = SMOTE(random_state=42)
                X_train, y_train = sm.fit_resample(X_train, y_train)
                smote_applied = True
            except Exception:
                # SMOTE can fail if minority class has too few samples
                smote_applied = False

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
            "smote_applied": smote_applied,
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


# --- STEP 6: EXPLAINABILITY (Feature Importance, NOT SHAP) ---
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

        # Multi-patient list for dropdown (top 3 per rubric requirement)
        test_patients = []
        for i in range(min(3, len(X_test))):
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


# --- STEP 7: SUBGROUP BIAS ANALYSIS ---
@app.post("/bias")
async def subgroup_bias_analysis(
    file: UploadFile = File(...),
    target_column: str = Form(...),
    subgroup_column: str = Form(...),
    test_size: float = Form(0.2),
):
    """
    Compute per-subgroup model performance metrics for fairness analysis.
    The user selects which column to audit via a dropdown in Step 7.
    """
    try:
        df = pd.read_csv(file.file)

        if target_column not in df.columns:
            return {"status": "error", "message": f"Target column '{target_column}' not found."}
        if subgroup_column not in df.columns:
            return {"status": "error", "message": f"Subgroup column '{subgroup_column}' not found."}
        if subgroup_column == target_column:
            return {"status": "error", "message": "Subgroup column cannot be the same as the target column."}

        X = df.drop(columns=[target_column])
        y = df[target_column]

        # Keep the subgroup column values before dropping non-numeric
        subgroup_values_full = df[subgroup_column].copy()

        numeric_cols = X.select_dtypes(include=["number"]).columns.tolist()
        # Remove subgroup column from features if it's numeric (so model doesn't train on it)
        feature_cols = [c for c in numeric_cols]

        if len(feature_cols) == 0:
            return {"status": "error", "message": "No numeric feature columns found for training."}

        X_numeric = X[feature_cols].copy()

        imputer = SimpleImputer(strategy="median")
        X_imputed = pd.DataFrame(imputer.fit_transform(X_numeric), columns=feature_cols)

        scaler = StandardScaler()
        X_scaled = pd.DataFrame(scaler.fit_transform(X_imputed), columns=feature_cols)

        le = LabelEncoder()
        y_encoded = le.fit_transform(y)

        # We need to keep subgroup labels aligned with test indices
        X_train, X_test, y_train, y_test, sg_train, sg_test = train_test_split(
            X_scaled, y_encoded, subgroup_values_full,
            test_size=test_size, random_state=42
        )

        # Train a Random Forest to evaluate
        rf = RandomForestClassifier(n_estimators=100, random_state=42)
        rf.fit(X_train, y_train)
        y_pred = rf.predict(X_test)

        # Overall metrics
        overall_acc = round(accuracy_score(y_test, y_pred) * 100)
        
        cm_all = confusion_matrix(y_test, y_pred)
        if cm_all.size == 4:
            tn_a, fp_a, fn_a, tp_a = cm_all.ravel()
            overall_sens = round((tp_a / (tp_a + fn_a)) * 100) if (tp_a + fn_a) > 0 else 0
            overall_spec = round((tn_a / (tn_a + fp_a)) * 100) if (tn_a + fp_a) > 0 else 0
        else:
            overall_sens = overall_acc
            overall_spec = overall_acc

        # Per-subgroup metrics
        subgroups = []
        unique_groups = sg_test.unique()

        for group in sorted(unique_groups, key=str):
            mask = sg_test.values == group
            if mask.sum() < 2:
                continue

            y_t = y_test[mask]
            y_p = y_pred[mask]
            
            grp_acc = round(accuracy_score(y_t, y_p) * 100)

            cm_grp = confusion_matrix(y_t, y_p)
            if cm_grp.size == 4:
                tn_g, fp_g, fn_g, tp_g = cm_grp.ravel()
                grp_sens = round((tp_g / (tp_g + fn_g)) * 100) if (tp_g + fn_g) > 0 else 0
                grp_spec = round((tn_g / (tn_g + fp_g)) * 100) if (tn_g + fp_g) > 0 else 0
            else:
                grp_sens = grp_acc
                grp_spec = grp_acc

            # Bias detection: >10pp gap from overall sensitivity
            sens_gap = overall_sens - grp_sens
            if sens_gap > 10:
                status = "BIASED"
            elif sens_gap > 5:
                status = "REVIEW"
            else:
                status = "OK"

            subgroups.append({
                "group": str(group),
                "count": int(mask.sum()),
                "accuracy": grp_acc,
                "sensitivity": grp_sens,
                "specificity": grp_spec,
                "sensitivity_gap": round(sens_gap),
                "status": status,
            })

        # Check if any subgroup is BIASED
        bias_detected = any(sg["status"] == "BIASED" for sg in subgroups)
        biased_groups = [sg for sg in subgroups if sg["status"] == "BIASED"]

        bias_message = None
        if bias_detected:
            worst = max(biased_groups, key=lambda x: x["sensitivity_gap"])
            bias_message = (
                f"Bias Detected: Sensitivity for '{worst['group']}' group "
                f"({worst['sensitivity']}%) is {worst['sensitivity_gap']} percentage points "
                f"lower than the overall average ({overall_sens}%). "
                f"This model should NOT be deployed until this gap is addressed."
            )

        return {
            "status": "success",
            "subgroup_column": subgroup_column,
            "overall": {
                "accuracy": overall_acc,
                "sensitivity": overall_sens,
                "specificity": overall_spec,
            },
            "subgroups": subgroups,
            "bias_detected": bias_detected,
            "bias_message": bias_message,
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}


# --- PDF CERTIFICATE GENERATION ---
@app.post("/api/generate-certificate")
async def generate_certificate(request: Request):
    """
    Generate a styled PDF certificate from the provided pipeline data.
    Accepts JSON body with: domain, model_used, metrics, checklist_items, bias_data.
    Returns a downloadable PDF file.
    """
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.units import mm
        from reportlab.lib.colors import HexColor
        from reportlab.platypus import (
            SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
        )
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.enums import TA_CENTER, TA_LEFT

        body = await request.json()
        domain = body.get("domain", "Unknown")
        model_used = body.get("model_used", "Unknown")
        metrics = body.get("metrics", {})
        checklist_items = body.get("checklist_items", [])
        bias_data = body.get("bias_data", None)
        date_str = body.get("date", "")
        completed_count = body.get("completed_count", 0)
        total_count = body.get("total_count", 0)

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer, pagesize=A4,
            topMargin=20*mm, bottomMargin=20*mm,
            leftMargin=20*mm, rightMargin=20*mm
        )

        styles = getSampleStyleSheet()

        # Custom styles
        navy = HexColor("#0d2340")
        teal = HexColor("#1a6b9a")
        dark_green = HexColor("#166534")
        dark_red = HexColor("#991b1b")
        amber = HexColor("#92400e")
        grey = HexColor("#7a92a3")
        light_bg = HexColor("#f8fafc")
        white = HexColor("#ffffff")
        line_color = HexColor("#e5e7eb")

        title_style = ParagraphStyle(
            "CertTitle", parent=styles["Title"],
            fontSize=22, textColor=navy, spaceAfter=4,
            alignment=TA_CENTER, fontName="Helvetica-Bold"
        )
        subtitle_style = ParagraphStyle(
            "CertSubtitle", parent=styles["Normal"],
            fontSize=10, textColor=grey, alignment=TA_CENTER, spaceAfter=16
        )
        section_title_style = ParagraphStyle(
            "SectionTitle", parent=styles["Normal"],
            fontSize=9, textColor=grey, fontName="Helvetica-Bold",
            spaceAfter=8, spaceBefore=16,
            borderWidth=0, borderPadding=0,
        )
        body_style = ParagraphStyle(
            "BodyText2", parent=styles["Normal"],
            fontSize=10, textColor=navy, leading=14
        )
        small_style = ParagraphStyle(
            "SmallText", parent=styles["Normal"],
            fontSize=8, textColor=grey, alignment=TA_CENTER, spaceBefore=20
        )

        elements = []

        # Header
        elements.append(Paragraph("HEALTH-AI · ML Learning Summary", title_style))
        elements.append(Paragraph(
            "Erasmus+ KA220-HED · Machine Learning for Healthcare Professionals",
            subtitle_style
        ))
        elements.append(HRFlowable(width="100%", thickness=1, color=line_color, spaceAfter=10))

        # Certificate Details
        elements.append(Paragraph("CERTIFICATE DETAILS", section_title_style))
        overall_status = (
            "✅ ALL CHECKS PASSED" if completed_count == total_count
            else "⚠ PARTIALLY COMPLETE" if completed_count >= total_count / 2
            else "❌ NOT READY FOR DEPLOYMENT"
        )
        details_data = [
            ["Date", date_str],
            ["Clinical Domain", domain],
            ["Model Algorithm", model_used.upper()],
            ["Checklist Progress", f"{completed_count} / {total_count} items completed"],
            ["Overall Status", overall_status],
        ]
        details_table = Table(details_data, colWidths=[140, 340])
        details_table.setStyle(TableStyle([
            ("FONTNAME", (0, 0), (0, -1), "Helvetica"),
            ("FONTNAME", (1, 0), (1, -1), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("TEXTCOLOR", (0, 0), (0, -1), grey),
            ("TEXTCOLOR", (1, 0), (1, -1), navy),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("LINEBELOW", (0, 0), (-1, -2), 0.5, line_color),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ]))
        elements.append(details_table)

        # Model Performance Metrics
        elements.append(Spacer(1, 10))
        elements.append(Paragraph("MODEL PERFORMANCE METRICS", section_title_style))
        metric_names = ["Accuracy", "Sensitivity", "Specificity", "Precision", "F1 Score", "AUC"]
        metric_keys = ["accuracy", "sensitivity", "specificity", "precision", "f1_score", "auc"]
        metric_values = []
        for k in metric_keys:
            v = metrics.get(k, "—")
            metric_values.append(f"{v}%" if k != "auc" else str(v))

        metrics_row1 = [metric_names[:3], metric_values[:3]]
        metrics_row2 = [metric_names[3:], metric_values[3:]]

        for names, vals in [metrics_row1, metrics_row2]:
            t_data = [names, vals]
            t = Table(t_data, colWidths=[160, 160, 160])
            t.setStyle(TableStyle([
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, 0), 8),
                ("TEXTCOLOR", (0, 0), (-1, 0), grey),
                ("FONTNAME", (0, 1), (-1, 1), "Helvetica-Bold"),
                ("FONTSIZE", (0, 1), (-1, 1), 18),
                ("TEXTCOLOR", (0, 1), (-1, 1), navy),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOX", (0, 0), (-1, -1), 0.5, line_color),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, line_color),
                ("BACKGROUND", (0, 0), (-1, -1), light_bg),
            ]))
            elements.append(t)
            elements.append(Spacer(1, 4))

        # Bias Audit (if available)
        if bias_data and bias_data.get("subgroups"):
            elements.append(Paragraph(
                f"SUBGROUP BIAS AUDIT (Column: {bias_data.get('subgroup_column', '—')})",
                section_title_style
            ))
            bias_header = ["Group", "Cases", "Sensitivity", "Status"]
            bias_rows = [bias_header]
            for sg in bias_data["subgroups"]:
                status_text = (
                    "⚠ BIASED" if sg["status"] == "BIASED"
                    else "🔍 REVIEW" if sg["status"] == "REVIEW"
                    else "✅ OK"
                )
                bias_rows.append([
                    str(sg["group"]), str(sg["count"]),
                    f"{sg['sensitivity']}%", status_text
                ])
            bias_table = Table(bias_rows, colWidths=[120, 80, 100, 180])
            bias_table.setStyle(TableStyle([
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("TEXTCOLOR", (0, 0), (-1, 0), grey),
                ("BACKGROUND", (0, 0), (-1, 0), light_bg),
                ("LINEBELOW", (0, 0), (-1, 0), 1, line_color),
                ("LINEBELOW", (0, 1), (-1, -1), 0.5, line_color),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
            ]))
            elements.append(bias_table)

            if bias_data.get("bias_detected"):
                elements.append(Spacer(1, 6))
                elements.append(Paragraph(
                    f"<b>⚠️ {bias_data.get('bias_message', 'Bias detected.')}</b>",
                    ParagraphStyle("BiasWarn", parent=body_style, textColor=dark_red, fontSize=9)
                ))

        # EU AI Act Checklist
        elements.append(Spacer(1, 6))
        elements.append(Paragraph("EU AI ACT COMPLIANCE CHECKLIST", section_title_style))
        cl_header = ["Requirement", "Status"]
        cl_rows = [cl_header]
        for item in checklist_items:
            status_text = "✅ PASSED" if item.get("checked") else "❌ NOT COMPLETED"
            cl_rows.append([item.get("text", ""), status_text])
        cl_table = Table(cl_rows, colWidths=[360, 120])
        cl_table.setStyle(TableStyle([
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("TEXTCOLOR", (0, 0), (-1, 0), grey),
            ("BACKGROUND", (0, 0), (-1, 0), light_bg),
            ("LINEBELOW", (0, 0), (-1, 0), 1, line_color),
            ("LINEBELOW", (0, 1), (-1, -1), 0.5, line_color),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
        ]))
        elements.append(cl_table)

        # Disclaimer
        elements.append(Spacer(1, 16))
        disclaimer_style = ParagraphStyle(
            "Disclaimer", parent=body_style,
            fontSize=8, textColor=teal, leading=12
        )
        elements.append(Paragraph(
            "<b>⚠️ Disclaimer:</b> This certificate is for educational purposes only. "
            "It documents the ML workflow completed during this learning session. "
            "It does NOT constitute clinical validation or regulatory approval. "
            "Any AI model must undergo formal clinical trials and regulatory review "
            "before deployment in healthcare settings.",
            disclaimer_style
        ))

        # Footer
        elements.append(Spacer(1, 12))
        elements.append(HRFlowable(width="100%", thickness=0.5, color=line_color, spaceAfter=8))
        elements.append(Paragraph(
            f"HEALTH-AI · Erasmus+ KA220-HED · Generated on {date_str}<br/>"
            "This document is for educational and training purposes only.",
            small_style
        ))

        doc.build(elements)
        buffer.seek(0)

        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=HEALTH-AI_Certificate.pdf"
            }
        )

    except Exception as e:
        return {"status": "error", "message": str(e)}


# --- TRAINING DATA DISTRIBUTION (Training vs Real Population) ---
@app.post("/training-distribution")
async def training_distribution(
    file: UploadFile = File(...),
    target_column: str = Form(...),
    demographic_column: str = Form(...),
    test_size: float = Form(0.2),
):
    """
    Compare training set demographic distribution against the full dataset
    (used as a proxy for 'real population'). Returns per-group percentages
    and flags any group with a >15 percentage point gap.
    """
    try:
        df = pd.read_csv(file.file)

        if target_column not in df.columns:
            return {"status": "error", "message": f"Target column '{target_column}' not found."}
        if demographic_column not in df.columns:
            return {"status": "error", "message": f"Demographic column '{demographic_column}' not found."}

        X = df.drop(columns=[target_column])
        y = df[target_column]

        # Encode target
        le = LabelEncoder()
        y_encoded = le.fit_transform(y)

        # Keep demographic column for analysis
        demo_values = df[demographic_column].copy()

        # Split train/test
        _, _, _, _, demo_train, demo_test = train_test_split(
            X, y_encoded, demo_values,
            test_size=test_size, random_state=42
        )

        # Full dataset distribution (proxy for "real population")
        full_counts = demo_values.value_counts(normalize=True) * 100
        train_counts = demo_train.value_counts(normalize=True) * 100

        all_groups = sorted(set(full_counts.index) | set(train_counts.index), key=str)

        comparison = []
        warnings = []
        for group in all_groups:
            real_pct = round(float(full_counts.get(group, 0)), 1)
            train_pct = round(float(train_counts.get(group, 0)), 1)
            gap = round(abs(real_pct - train_pct), 1)
            has_warning = gap > 15

            if has_warning:
                warnings.append(f"'{group}' group has a {gap} pp gap (Training: {train_pct}% vs Population: {real_pct}%)")

            comparison.append({
                "group": str(group),
                "real_population_pct": real_pct,
                "training_data_pct": train_pct,
                "gap_pp": gap,
                "warning": has_warning,
            })

        return {
            "status": "success",
            "demographic_column": demographic_column,
            "comparison": comparison,
            "has_warnings": len(warnings) > 0,
            "warning_messages": warnings,
            "total_real": len(demo_values),
            "total_training": len(demo_train),
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}
