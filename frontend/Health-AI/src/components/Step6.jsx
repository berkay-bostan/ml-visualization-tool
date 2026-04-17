import React, { useState, useEffect } from "react";

// ──────────────────────────────────────────────
// Clinical Display Name Mapping
// Maps raw CSV column names → human-readable clinical labels.
// Unmapped columns fall back to Title Case.
// ──────────────────────────────────────────────
const CLINICAL_LABELS = {
  // Demographics
  age: "Patient Age",
  sex: "Biological Sex",
  gender: "Patient Gender",
  male: "Male Gender Indicator",
  female: "Female Gender Indicator",
  race: "Patient Race",
  ethnicity: "Patient Ethnicity",

  // Vital Signs
  bp: "Blood Pressure",
  blood_pressure: "Blood Pressure",
  blood_press: "Blood Pressure",
  systolic_bp: "Systolic Blood Pressure",
  diastolic_bp: "Diastolic Blood Pressure",
  heart_rate: "Heart Rate",
  pulse: "Pulse Rate",
  resting_bp: "Resting Blood Pressure",
  restingbp: "Resting Blood Pressure",
  trestbps: "Resting Blood Pressure (mmHg)",
  thalach: "Maximum Heart Rate Achieved",
  thalach_max: "Maximum Heart Rate Achieved",

  // Body Measurements
  bmi: "Body Mass Index",
  weight: "Body Weight",
  height: "Patient Height",
  skin_thickness: "Skin Fold Thickness",
  skinthickness: "Skin Fold Thickness",

  // Metabolic & Blood Chemistry
  glucose: "Blood Glucose Level",
  plasma_glucose: "Plasma Glucose Concentration",
  insulin: "Serum Insulin Level",
  cholesterol: "Total Cholesterol",
  chol: "Total Cholesterol",
  hdl: "HDL Cholesterol (Good)",
  ldl: "LDL Cholesterol (Bad)",
  triglycerides: "Triglyceride Level",
  hba1c: "Haemoglobin A1c",

  // Kidney / Renal
  creatinine: "Serum Creatinine",
  serum_creatinine: "Serum Creatinine",
  blood_urea: "Blood Urea Nitrogen",
  urea: "Blood Urea",
  albumin: "Serum Albumin",
  sodium: "Serum Sodium",
  potassium: "Serum Potassium",
  haemoglobin: "Haemoglobin Level",
  hemoglobin: "Haemoglobin Level",
  red_blood_cells: "Red Blood Cell Count",
  white_blood_cells: "White Blood Cell Count",
  rbc: "Red Blood Cell Count",
  wbc: "White Blood Cell Count",
  pcv: "Packed Cell Volume",
  rc: "Red Cell Count",
  wc: "White Cell Count",
  bgr: "Blood Glucose Random",
  bu: "Blood Urea",
  sc: "Serum Creatinine",
  sod: "Sodium",
  pot: "Potassium",
  hemo: "Haemoglobin",
  sg: "Specific Gravity",
  al: "Albumin",
  su: "Sugar",
  ba: "Bacteria",
  htn: "Hypertension",
  dm: "Diabetes Mellitus",
  cad: "Coronary Artery Disease",
  appet: "Appetite",
  pe: "Pedal Oedema",
  ane: "Anaemia",

  // Cardiac
  ejection_fraction: "Ejection Fraction",
  cpk: "Creatine Phosphokinase (CPK)",
  creatinine_phosphokinase: "Creatine Phosphokinase (CPK)",
  platelets: "Platelet Count",
  serum_sodium: "Serum Sodium",
  ca: "Calcium (Fluoroscopy Vessels)",
  cp: "Chest Pain Type",
  fbs: "Fasting Blood Sugar > 120 mg/dl",
  restecg: "Resting ECG Result",
  exang: "Exercise-Induced Angina",
  oldpeak: "ST Depression (Exercise vs Rest)",
  slope: "ST Segment Slope (Peak Exercise)",
  thal: "Thalassaemia Type",
  chestpain: "Chest Pain Type",
  maxhr: "Maximum Heart Rate",

  // Liver
  total_bilirubin: "Total Bilirubin",
  direct_bilirubin: "Direct Bilirubin",
  total_protein: "Total Protein",
  alb: "Albumin",
  ag_ratio: "Albumin/Globulin Ratio",
  sgpt: "SGPT (ALT) Enzyme",
  sgot: "SGOT (AST) Enzyme",
  alkphos: "Alkaline Phosphatase",

  // Diabetes (Pima)
  pregnancies: "Number of Pregnancies",
  bloodpressure: "Blood Pressure (mm Hg)",
  diabetespedigreefunction: "Diabetes Pedigree Function",
  dpf: "Diabetes Pedigree Function",
  outcome: "Diabetes Outcome",

  // Breast Cancer
  radius_mean: "Mean Tumour Radius",
  texture_mean: "Mean Tumour Texture",
  perimeter_mean: "Mean Tumour Perimeter",
  area_mean: "Mean Tumour Area",
  smoothness_mean: "Mean Tumour Smoothness",
  compactness_mean: "Mean Tumour Compactness",
  concavity_mean: "Mean Tumour Concavity",
  symmetry_mean: "Mean Tumour Symmetry",
  fractal_dimension_mean: "Mean Fractal Dimension",
  concave_points_mean: "Mean Concave Points",

  // Stroke
  hypertension: "Hypertension History",
  heart_disease: "Heart Disease History",
  ever_married: "Marital Status",
  work_type: "Employment Type",
  residence_type: "Residence Type (Urban/Rural)",
  avg_glucose_level: "Average Glucose Level",
  smoking_status: "Smoking Status",

  // Parkinson's
  mdvp_fo: "Fundamental Frequency (Fo)",
  mdvp_fhi: "Maximum Vocal Frequency",
  mdvp_flo: "Minimum Vocal Frequency",
  mdvp_jitter: "Vocal Jitter (%)",
  mdvp_shimmer: "Vocal Shimmer (dB)",
  nhr: "Noise-to-Harmonics Ratio",
  hnr: "Harmonics-to-Noise Ratio",
  rpde: "Recurrence Period Density Entropy",
  dfa: "Detrended Fluctuation Analysis",
  spread1: "Nonlinear Fundamental Frequency (Spread1)",
  spread2: "Nonlinear Fundamental Frequency (Spread2)",
  d2: "Correlation Dimension",
  ppe: "Pitch Period Entropy",
  status: "Parkinson's Status",

  // Fetal Health
  baseline_value: "Baseline Fetal Heart Rate",
  accelerations: "Number of Accelerations",
  fetal_movement: "Fetal Movement Count",
  uterine_contractions: "Uterine Contraction Count",
  light_decelerations: "Light Decelerations",
  severe_decelerations: "Severe Decelerations",
  prolongued_decelerations: "Prolonged Decelerations",
  abnormal_short_term_variability: "Abnormal Short-Term Variability",
  mean_value_of_short_term_variability: "Mean Short-Term Variability",
  percentage_of_time_with_abnormal_long_term_variability: "Abnormal Long-Term Variability %",
  mean_value_of_long_term_variability: "Mean Long-Term Variability",
  histogram_width: "Histogram Width",
  histogram_min: "Histogram Minimum",
  histogram_max: "Histogram Maximum",
  histogram_number_of_peaks: "Histogram Peak Count",
  histogram_number_of_zeroes: "Histogram Zero Count",
  histogram_mode: "Histogram Mode",
  histogram_mean: "Histogram Mean",
  histogram_median: "Histogram Median",
  histogram_variance: "Histogram Variance",
  histogram_tendency: "Histogram Tendency",

  // General
  time: "Follow-Up Time (Days)",
  smoking: "Smoking Status",
  anaemia: "Anaemia",
  diabetes: "Diabetes",
  high_blood_pressure: "High Blood Pressure",
  id: "Patient ID",
  classification: "Disease Classification",
  diagnosis: "Diagnosis",
  death_event: "Death Event",
  target: "Target Variable",
  class: "Classification",
  result: "Result",
  label: "Label",
};

/**
 * Returns a clinical display name for a raw column name.
 * Falls back to Title Case if not found in the dictionary.
 */
function getDisplayName(rawName) {
  if (!rawName) return rawName;
  const key = rawName.toLowerCase().trim();
  if (CLINICAL_LABELS[key]) return CLINICAL_LABELS[key];
  // Fallback: convert snake_case to Title Case
  return rawName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ──────────────────────────────────────────────
// Domain-Specific Clinical Sense-Check Texts
// 20 unique paragraphs for 20 clinical specialties
// ──────────────────────────────────────────────
const DOMAIN_SENSE_CHECKS = {
  "Cardiology":
    "In heart failure readmission models, ejection fraction and serum creatinine typically dominate feature importance. If patient age alone ranks highest, the model may be acting as a proxy for general frailty rather than cardiac-specific risk factors like ventricular dysfunction or fluid overload.",

  "Radiology":
    "For imaging-based classification, pixel-derived texture and density features should carry the most weight. If patient demographics rank higher than image features, the model may be encoding referral patterns or equipment differences rather than genuine radiological findings.",

  "Nephrology":
    "Chronic kidney disease models should prioritise GFR-related markers such as serum creatinine, albumin, and haemoglobin. If blood pressure or diabetes indicator columns dominate, the model may be detecting comorbidities without learning direct renal pathology.",

  "Oncology — Breast":
    "Breast cancer biopsy models should place highest importance on cell morphometry features — mean radius, texture, and concavity. If patient ID or row-index features appear, this indicates a data leakage problem that must be fixed before any clinical use.",

  "Neurology — Parkinson's":
    "Parkinson's voice biomarker models should highlight jitter, shimmer, and harmonics-to-noise ratio (HNR). If demographic features like age dominate over vocal measurements, the model may be learning age-related prevalence rather than disease-specific acoustic signatures.",

  "Endocrinology — Diabetes":
    "Glucose concentration and insulin resistance markers (BMI, blood pressure) should rank highly for diabetes onset prediction. If pregnancy count dominates, the model may be over-fitting to the Pima Indian demographic rather than learning generalisable metabolic risk factors.",

  "Hepatology — Liver":
    "Liver disease models should prioritise hepatic enzyme levels (SGPT/ALT, SGOT/AST, alkaline phosphatase) and bilirubin. If albumin-globulin ratio ranks unexpectedly low while age ranks high, the model may be learning demographic confounders rather than hepatic function.",

  "Cardiology — Stroke":
    "Stroke prediction models should weigh hypertension history, average glucose level, and heart disease as top features. If marital status or work type appears disproportionately important, the model is likely picking up socioeconomic correlates rather than direct vascular risk factors.",

  "Mental Health":
    "Depression severity classification should be driven by PHQ-9 questionnaire response patterns and symptom frequency scores. If demographic features like age or gender dominate, the model may be learning prevalence rates rather than individual symptom severity.",

  "Pulmonology — COPD":
    "COPD exacerbation models should place FEV1, FEV1/FVC ratio, and smoking history as top predictors. If body weight or age dominates over spirometry values, the model may be confusing general decline with disease-specific pulmonary mechanics.",

  "Haematology — Anaemia":
    "Anaemia classification should be driven by haemoglobin, MCV, MCH, and red blood cell counts. If white blood cell counts rank highest, the model may be detecting infection-related changes rather than the underlying anaemia pathology.",

  "Dermatology":
    "Skin lesion classification should rely on dermoscopic features like asymmetry, border irregularity, colour variation, and diameter. If lesion location or patient age dominates, the model may be acting as a demographic prior rather than learning visual pathology characteristics.",

  "Ophthalmology":
    "Diabetic retinopathy models should highlight microaneurysm count, hard exudate area, and macula distance as principal features. If systemic HbA1c or patient age dominate over retinal findings, the model may lack specificity for actual fundoscopic changes.",

  "Orthopaedics — Spine":
    "Vertebral column classification should weight biomechanical features — pelvic incidence, pelvic tilt, lumbar lordosis angle, and sacral slope. If degree of spondylolisthesis alone dominates all other features, the model may have a single-variable dependency that limits its generalisability.",

  "ICU / Sepsis":
    "Sepsis prediction models should strongly weigh vital-sign trends (heart rate variability, mean arterial pressure, temperature) and acute lab changes (lactate, WBC). If static demographic features outrank dynamic vitals, the model may be detecting ICU admission patterns rather than sepsis onset.",

  "Obstetrics — Fetal Health":
    "Fetal cardiotocography models should be driven by accelerations, decelerations, baseline heart rate, and short-term variability. If histogram-derived statistical features like mode or variance dominate, the model may be fitting to signal processing artefacts rather than genuine fetal distress indicators.",

  "Cardiology — Arrhythmia":
    "Arrhythmia detection should emphasise ECG-derived features such as QRS duration, P-wave morphology, and RR interval. If patient weight or age outranks all electrical features, the model may be learning demographic risk profiles rather than actual cardiac rhythm abnormalities.",

  "Oncology — Cervical":
    "Cervical cancer risk models should highlight HPV test results, number of sexual partners, and years of hormonal contraceptive use. If age alone dominates, the model may be learning screening frequency patterns rather than true biological risk factors for cervical neoplasia.",

  "Thyroid / Endocrinology":
    "Thyroid classification models should place TSH, T3, T4, and FTI as the most important predictors. If referral source or patient sex dominates, the model may be learning clinical pathway biases rather than actual thyroid hormone imbalances.",

  "Pharmacy — Readmission":
    "Hospital readmission models for diabetic patients should weigh number of inpatient visits, number of medications, and HbA1c change as top features. If discharge disposition or admission source ranks highest, the model may be encoding healthcare system workflows rather than patient-level clinical risk.",
};

export default function Step6({
  onNext,
  onPrev,
  file,
  targetColumn,
  selectedDomain,
}) {
  const [explainData, setExplainData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPatientIdx, setSelectedPatientIdx] = useState(null);
  const [whatIfFeature, setWhatIfFeature] = useState(null);

  const fetchExplanation = async (patientIdx = null) => {
    if (!file || !targetColumn) {
      setError("File or target column is missing. Go back to Step 2.");
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_column", targetColumn);
    if (patientIdx !== null) {
      formData.append("patient_index", patientIdx);
    }

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL || ""}/explain`, {
        method: "POST",
        body: formData,
      });
      const data = await resp.json();
      if (data.status === "success") {
        setExplainData(data);
        if (patientIdx === null) {
          setSelectedPatientIdx(data.patient_explanation.patient_index);
        }
        setWhatIfFeature(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Could not connect to backend. Is FastAPI running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (file && targetColumn && !explainData) {
      fetchExplanation();
    }
  }, [file, targetColumn]);

  const maxImportance = explainData?.feature_importance?.[0]?.importance || 1;
  const maxContrib = explainData?.patient_explanation?.contributions?.[0]
    ? Math.max(
        ...explainData.patient_explanation.contributions.map((c) =>
          Math.abs(c.contribution),
        ),
      )
    : 1;

  const pe = explainData?.patient_explanation;

  const handlePatientSelect = (e) => {
    const pIdx = parseInt(e.target.value);
    setSelectedPatientIdx(pIdx);
    fetchExplanation(pIdx);
  };

  // Get the domain-specific sense-check text, with a fallback
  const senseCheckText =
    DOMAIN_SENSE_CHECKS[selectedDomain] ||
    `Review the feature ranking above. Does it align with established clinical evidence for ${selectedDomain}? If an irrelevant variable shows high importance, the model might be learning a bias or correlation rather than medical causality.`;

  return (
    <section className="screen active">
      <div className="screen-header">
        <div>
          <span className="step-tag">STEP 6 OF 7</span>
          <h2>Explainability — Why Did the Model Make This Prediction?</h2>
          <p>
            A model that cannot explain itself should not be trusted in clinical
            settings. Here we look at which patient measurements were most
            important, and why a specific patient was flagged as high risk.
          </p>
        </div>
        <div className="hdr-right">
          <button className="btn primary" onClick={onNext}>
            Next Step →
          </button>
        </div>
      </div>

      {loading && (
        <div
          className="card"
          style={{ textAlign: "center", padding: "40px", color: "var(--mid)" }}
        >
          ⏳ Analysing feature importance... This may take a moment.
        </div>
      )}

      {error && (
        <div className="banner bad" style={{ marginBottom: "15px" }}>
          <div className="banner-icon">❌</div>
          <div>{error}</div>
        </div>
      )}

      {!loading && !error && !explainData && (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <h3 style={{ color: "var(--navy)", marginBottom: "10px" }}>
            No Explanation Data
          </h3>
          <p style={{ color: "var(--mid)" }}>
            Upload a dataset and select a target column, then come back here.
          </p>
          <button
            className="btn primary"
            style={{ marginTop: "15px" }}
            onClick={() => fetchExplanation(null)}
          >
            🔍 Generate Explanation
          </button>
        </div>
      )}

      {explainData && (
        <div className="cols">
          {/* LEFT COLUMN */}
          <div>
            <div className="card">
              <div className="card-title">
                Most Important Patient Measurements (Overall)
              </div>
              <div className="bars" style={{ display: "grid", gap: "12px" }}>
                {explainData.feature_importance.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "130px",
                        fontSize: "12px",
                        color: "var(--mid)",
                        textAlign: "right",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={`Raw column: ${item.feature}`}
                    >
                      {getDisplayName(item.feature)}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: "10px",
                        borderRadius: "999px",
                        background: "var(--line)",
                      }}
                    >
                      <div
                        style={{
                          width: `${(item.importance / maxImportance) * 100}%`,
                          height: "100%",
                          borderRadius: "999px",
                          background: "var(--navy)",
                          transition: "width 0.4s ease",
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        width: "40px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {item.importance}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="banner info"
                style={{
                  marginTop: "15px",
                  background: "#eff6ff",
                  borderColor: "#bfdbfe",
                }}
              >
                <div className="banner-icon">💡</div>
                <div style={{ color: "#1e40af" }}>
                  <b>Clinical Sense-Check — {selectedDomain}:</b>{" "}
                  {senseCheckText}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <div className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <div className="card-title" style={{ margin: 0 }}>
                  Patient Explanation Waterfall
                </div>
                <select
                  className="sel"
                  value={selectedPatientIdx || ""}
                  onChange={handlePatientSelect}
                  style={{ width: "200px" }}
                >
                  <option value="" disabled>
                    Select Test Patient
                  </option>
                  {explainData.test_patients.map((p) => (
                    <option key={p.patient_index} value={p.patient_index}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--navy)",
                  marginBottom: "5px",
                }}
              >
                Prediction for Patient #{pe?.patient_index}: {pe?.risk_percent}%
                Risk
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--mid)",
                  marginBottom: "20px",
                }}
              >
                The bars below show how each measurement pushed this specific
                patient's risk higher (Red) or lower (Green).
              </div>

              <div className="bars" style={{ display: "grid", gap: "12px" }}>
                {pe?.contributions.map((c, i) => {
                  const isRisk = c.direction === "risk";
                  const barColor = isRisk ? "var(--bad)" : "var(--good)";
                  const textColor = isRisk ? "var(--bad)" : "var(--good)";
                  const arrow = isRisk ? "↑" : "↓";
                  const barWidth = `${Math.min((Math.abs(c.contribution) / maxContrib) * 100, 100)}%`;

                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                        padding: "4px",
                        borderRadius: "8px",
                      }}
                      onClick={() => setWhatIfFeature(c)}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f1f5f9")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div
                        style={{
                          width: "140px",
                          fontSize: "12px",
                          color: textColor,
                          textAlign: "right",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={`Raw column: ${c.feature} = ${c.value}`}
                      >
                        {arrow} {getDisplayName(c.feature)} ({c.value})
                      </div>
                      <div
                        style={{
                          flex: 1,
                          height: "10px",
                          borderRadius: "999px",
                          background: "var(--line)",
                        }}
                      >
                        <div
                          style={{
                            width: barWidth,
                            height: "100%",
                            borderRadius: "999px",
                            background: barColor,
                            transition: "width 0.4s ease",
                          }}
                        ></div>
                      </div>
                      <div
                        style={{
                          width: "50px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: textColor,
                        }}
                      >
                        {c.contribution > 0 ? "+" : ""}
                        {c.contribution}
                      </div>
                    </div>
                  );
                })}
              </div>

              {whatIfFeature && (
                <div
                  className="banner info"
                  style={{
                    marginTop: "20px",
                    background: "#f0fdfa",
                    borderColor: "#99f6e4",
                  }}
                >
                  <div className="banner-icon">🔄</div>
                  <div style={{ color: "#115e59", fontSize: "13px" }}>
                    <b>What-If Analysis:</b> If we improved Patient #
                    {pe?.patient_index}'s <b>{getDisplayName(whatIfFeature.feature)}</b> towards
                    a healthier value, their predicted risk could shift by
                    approximately{" "}
                    <b>
                      {whatIfFeature.what_if_effect > 0 ? "+" : ""}
                      {whatIfFeature.what_if_effect}
                    </b>
                    .
                  </div>
                </div>
              )}

              <div
                className="banner warn"
                style={{
                  marginTop: "20px",
                  background: "#fffbeb",
                  borderColor: "#fde68a",
                }}
              >
                <div className="banner-icon">⚠️</div>
                <div style={{ color: "#92400e" }}>
                  <b>Important:</b> These are associations, not causes. The
                  model says certain features are important for this prediction
                  — a clinician must decide whether and how to act.{" "}
                  <em>
                    (Click on any feature above for a 'What-If' simulation).
                  </em>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="screen-footer">
        <button className="btn outline" onClick={onPrev}>
          ← Previous
        </button>
        <button className="btn primary" onClick={onNext}>
          Next Step →
        </button>
      </div>
    </section>
  );
}
