import React, { useState, useEffect } from "react";

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
      const resp = await fetch("http://backend:8000/explain", {
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
                      title={item.feature}
                    >
                      {item.feature}
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
                  <b>Clinical sense check for {selectedDomain}:</b> Does this
                  feature ranking match clinical reality? If an irrelevant
                  variable shows high importance, the model might be learning a
                  bias or correlation rather than medical causality.
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
                        title={`${c.feature} = ${c.value}`}
                      >
                        {arrow} {c.feature} ({c.value})
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
                    {pe?.patient_index}'s <b>{whatIfFeature.feature}</b> towards
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
