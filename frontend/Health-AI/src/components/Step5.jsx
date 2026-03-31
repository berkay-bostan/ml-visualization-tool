import React from "react";

export default function Step5({ onNext, onPrev, trainResults }) {
  if (!trainResults) {
    return (
      <section className="screen active">
        <div
          className="card"
          style={{ padding: "50px", textAlign: "center", marginTop: "20px" }}
        >
          <h3 style={{ color: "var(--navy)" }}>No Model Trained Yet</h3>
          <p style={{ color: "var(--mid)", marginTop: "10px" }}>
            Please go back to Step 4, select an algorithm, and click "Train
            Model".
          </p>
          <button
            className="btn primary"
            style={{ marginTop: "20px" }}
            onClick={onPrev}
          >
            ← Go to Step 4
          </button>
        </div>
      </section>
    );
  }

  const { metrics, confusion_matrix, model_used } = trainResults;

  const rocCurvePath =
    metrics.auc > 0.5
      ? `M 0,200 Q 20,${200 - metrics.auc * 200} 200,0`
      : `M 0,200 L 200,0`;

  return (
    <section className="screen active">
      <div className="screen-header">
        <div>
          <span className="step-tag">STEP 5 OF 7</span>
          <h2>Results — How Well Does the Model Perform?</h2>
          <p>
            Here we evaluate the model's predictions on the test patients it has
            never seen before.
          </p>
        </div>
        <div className="hdr-right">
          <button className="btn primary" onClick={onNext}>
            Next Step →
          </button>
        </div>
      </div>

      <div className="cols">
        {/* SOL KOLON: METRİKLER VE ROC CURVE */}
        <div>
          <div className="card">
            <div className="card-title">
              Performance Metrics — {model_used.toUpperCase()}
            </div>

            {/* 5 Metrik Grid (AUC aşağıda olacak şekilde toplam 6) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "8px",
              }}
            >
              <div
                title="Out of all test patients, what percentage did the AI classify correctly?"
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  padding: "10px 5px",
                  textAlign: "center",
                  cursor: "help",
                }}
              >
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "var(--navy)",
                  }}
                >
                  {metrics.accuracy}%
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    color: "var(--muted)",
                    marginTop: "4px",
                  }}
                >
                  ACCURACY
                </div>
              </div>

              <div
                title="Of patients who WERE at risk, how many did the AI catch?"
                style={{
                  border: `1px solid ${metrics.sensitivity < 50 ? "rgba(185,28,28,.4)" : "rgba(13,122,80,.2)"}`,
                  background:
                    metrics.sensitivity < 50 ? "#fef2f2" : "var(--good-bg)",
                  borderRadius: "8px",
                  padding: "10px 5px",
                  textAlign: "center",
                  cursor: "help",
                }}
              >
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color:
                      metrics.sensitivity < 50 ? "var(--bad)" : "var(--good)",
                  }}
                >
                  {metrics.sensitivity}%
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    color:
                      metrics.sensitivity < 50 ? "var(--bad)" : "var(--good)",
                    marginTop: "4px",
                  }}
                >
                  SENSITIVITY ★
                </div>
              </div>

              <div
                title="Of patients who were NOT at risk, how many did the AI correctly identify as safe?"
                style={{
                  border: "1px solid rgba(13,122,80,.2)",
                  background: "var(--good-bg)",
                  borderRadius: "8px",
                  padding: "10px 5px",
                  textAlign: "center",
                  cursor: "help",
                }}
              >
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "var(--good)",
                  }}
                >
                  {metrics.specificity}%
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    color: "var(--good)",
                    marginTop: "4px",
                  }}
                >
                  SPECIFICITY
                </div>
              </div>

              <div
                title="Of all patients the AI flagged as high-risk, how many actually were high-risk?"
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  padding: "10px 5px",
                  textAlign: "center",
                  cursor: "help",
                }}
              >
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "var(--navy)",
                  }}
                >
                  {metrics.precision || 0}%
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    color: "var(--muted)",
                    marginTop: "4px",
                  }}
                >
                  PRECISION
                </div>
              </div>

              <div
                title="A combined score balancing Sensitivity and Precision."
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  padding: "10px 5px",
                  textAlign: "center",
                  cursor: "help",
                }}
              >
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "var(--navy)",
                  }}
                >
                  {metrics.f1_score || 0}%
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    color: "var(--muted)",
                    marginTop: "4px",
                  }}
                >
                  F1 SCORE
                </div>
              </div>
            </div>

            {/* DANGER BANNER: Sens < %50 ise */}
            {metrics.sensitivity < 50 && (
              <div
                className="banner bad"
                style={{
                  marginTop: "15px",
                  background: "#fef2f2",
                  borderColor: "#fca5a5",
                  padding: "12px",
                }}
              >
                <div className="banner-icon">🚨</div>
                <div style={{ color: "#991b1b" }}>
                  <b>DANGER - Low Sensitivity:</b> Model misses more than half
                  of the true cases. Unsafe for clinical deployment!
                </div>
              </div>
            )}

            {/* ROC CURVE (SVG) */}
            <div style={{ marginTop: "25px" }}>
              <div className="card-title">ROC Curve</div>
              <div
                style={{ display: "flex", gap: "20px", alignItems: "center" }}
              >
                <svg
                  width="150"
                  height="150"
                  style={{
                    background: "var(--paper)",
                    borderLeft: "2px solid var(--ink)",
                    borderBottom: "2px solid var(--ink)",
                  }}
                >
                  <path
                    d="M 0,150 L 150,0"
                    stroke="var(--muted)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                  />
                  {/* ROC Çizgisi Ölçeklemesi (150px) */}
                  <path
                    d={
                      metrics.auc > 0.5
                        ? `M 0,150 Q 15,${150 - metrics.auc * 150} 150,0`
                        : `M 0,150 L 150,0`
                    }
                    stroke="var(--blue)"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
                <div
                  title="Score for how well the model separates high-risk from low-risk patients overall."
                  style={{ cursor: "help" }}
                >
                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: 700,
                      color: "var(--blue)",
                    }}
                  >
                    {metrics.auc}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--muted)",
                    }}
                  >
                    AUC SCORE
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--mid)",
                      marginTop: "10px",
                      lineHeight: 1.5,
                    }}
                  >
                    The closer the blue line is to the top-left corner (AUC =
                    1.0), the better the model distinguishes between safe and
                    high-risk patients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ KOLON: CONFUSION MATRIX */}
        <div>
          <div className="card">
            <div className="card-title">Confusion Matrix</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr 1fr",
                gap: "8px",
                marginTop: "15px",
              }}
            >
              <div></div>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--muted)",
                }}
              >
                Predicted: SAFE
              </div>
              <div
                style={{
                  textAlign: "center",
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
                  textAlign: "center",
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
                  borderRadius: "10px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "var(--good)",
                  }}
                >
                  {confusion_matrix.tn}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--good)",
                    marginTop: "5px",
                  }}
                >
                  ✅ True Negative
                </div>
              </div>
              <div
                style={{
                  background: "var(--warn-bg)",
                  border: "1px solid rgba(160,92,0,.2)",
                  borderRadius: "10px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "var(--warn)",
                  }}
                >
                  {confusion_matrix.fp}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--warn)",
                    marginTop: "5px",
                  }}
                >
                  ⚠️ False Positive
                </div>
              </div>

              <div
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  textAlign: "center",
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
                  borderRadius: "10px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "var(--bad)",
                  }}
                >
                  {confusion_matrix.fn}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--bad)",
                    marginTop: "5px",
                  }}
                >
                  ❌ False Negative
                </div>
              </div>
              <div
                style={{
                  background: "var(--good-bg)",
                  border: "1px solid rgba(13,122,80,.2)",
                  borderRadius: "10px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "var(--good)",
                  }}
                >
                  {confusion_matrix.tp}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--good)",
                    marginTop: "5px",
                  }}
                >
                  ✅ True Positive
                </div>
              </div>
            </div>

            <div className="banner info" style={{ marginTop: "20px" }}>
              <div className="banner-icon">ℹ️</div>
              <div>
                <b>Clinical Translation:</b> The model missed{" "}
                {confusion_matrix.fn} true cases, but caught{" "}
                {confusion_matrix.tp}. False alarms ({confusion_matrix.fp}) mean
                unnecessary checks, but False Negatives ({confusion_matrix.fn})
                are safety risks.
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
