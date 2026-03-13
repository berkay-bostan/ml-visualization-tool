import React from "react";

export default function Step5({ onNext, onPrev }) {
  return (
    <section className="screen active">
      <div className="screen-header">
        <div>
          <span className="step-tag">STEP 5 OF 7</span>
          <h2>Results — How Well Does the Model Perform?</h2>
          <p>
            Here we evaluate the model's predictions on the test patients it has
            never seen before. Accuracy alone is not enough — we examine
            sensitivity and specificity.
          </p>
        </div>
        <div className="hdr-right">
          <button className="btn primary" onClick={onNext}>
            Next Step →
          </button>
        </div>
      </div>

      <div className="cols">
        {/* METRİKLER (Sol Taraf) */}
        <div>
          <div className="card">
            <div className="card-title">
              Performance Metrics — KNN (K=5) on Test Patients
            </div>
            <div
              className="kpis"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
              }}
            >
              <div className="kpi">
                <div className="kpi-val">78%</div>
                <div className="kpi-name">Accuracy</div>
              </div>
              <div className="kpi warn">
                <div className="kpi-val" style={{ color: "var(--warn)" }}>
                  62%
                </div>
                <div className="kpi-name">Sensitivity</div>
              </div>
              <div className="kpi good">
                <div className="kpi-val" style={{ color: "var(--good)" }}>
                  85%
                </div>
                <div className="kpi-name">Specificity</div>
              </div>
              <div className="kpi">
                <div className="kpi-val">58%</div>
                <div className="kpi-name">Precision</div>
              </div>
              <div className="kpi">
                <div className="kpi-val">60%</div>
                <div className="kpi-name">F1 Score</div>
              </div>
              <div className="kpi good">
                <div className="kpi-val" style={{ color: "var(--good)" }}>
                  0.81
                </div>
                <div className="kpi-name">AUC-ROC</div>
              </div>
            </div>
            <div className="banner bad" style={{ marginTop: "12px" }}>
              <div className="banner-icon">⚠️</div>
              <div>
                <b>Low Sensitivity:</b> This model misses 38% of patients who
                will actually be readmitted. Go back to Step 4 and try a
                different model.
              </div>
            </div>
          </div>
        </div>

        {/* HATA MATRİSİ (Sağ Taraf) */}
        <div>
          <div className="card">
            <div className="card-title">
              Confusion Matrix — What Did the Model Get Right and Wrong?
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--mid)",
                marginBottom: "10px",
              }}
            >
              This 2×2 table shows the model's predictions vs. what actually
              happened.
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr 1fr",
                gap: "8px",
                textAlign: "center",
              }}
            >
              <div></div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--muted)",
                }}
              >
                Predicted: SAFE
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--muted)",
                }}
              >
                Predicted: RISK
              </div>

              <div
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "var(--muted)",
                }}
              >
                Actual: SAFE
              </div>
              <div
                style={{
                  background: "var(--good-bg)",
                  border: "1px solid rgba(13,122,80,.2)",
                  padding: "15px",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--good)",
                  }}
                >
                  36
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--good)",
                    marginTop: "5px",
                  }}
                >
                  ✅ Correctly called safe
                </div>
              </div>
              <div
                style={{
                  background: "var(--warn-bg)",
                  border: "1px solid rgba(160,92,0,.2)",
                  padding: "15px",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--warn)",
                  }}
                >
                  5
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--warn)",
                    marginTop: "5px",
                  }}
                >
                  ⚠️ False alarm
                </div>
              </div>

              <div
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "var(--muted)",
                }}
              >
                Actual: RISK
              </div>
              <div
                style={{
                  background: "var(--bad-bg)",
                  border: "1px solid rgba(185,28,28,.2)",
                  padding: "15px",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--bad)",
                  }}
                >
                  8
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--bad)",
                    marginTop: "5px",
                  }}
                >
                  ❌ Missed case
                </div>
              </div>
              <div
                style={{
                  background: "var(--good-bg)",
                  border: "1px solid rgba(13,122,80,.2)",
                  padding: "15px",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--good)",
                  }}
                >
                  12
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--good)",
                    marginTop: "5px",
                  }}
                >
                  ✅ Correctly flagged
                </div>
              </div>
            </div>

            <div className="banner bad" style={{ marginTop: "15px" }}>
              <div className="banner-icon">❌</div>
              <div>
                <b>8 patients were missed (False Negatives).</b> These patients
                were sent home without extra support but returned to hospital.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="screen-footer"
        style={{
          marginTop: "15px",
          padding: "15px",
          background: "white",
          borderRadius: "12px",
          border: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
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
