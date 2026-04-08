import React, { useState, useEffect } from "react";

export default function Step5({ onNext, onPrev, trainResults, setTrainResults, allTrainedModels }) {
  // Currently selected model index — default to the last trained model
  const [selectedIdx, setSelectedIdx] = useState(
    allTrainedModels.length > 0 ? allTrainedModels.length - 1 : 0
  );

  // Keep selectedIdx in sync when allTrainedModels grows
  useEffect(() => {
    if (allTrainedModels.length > 0 && selectedIdx >= allTrainedModels.length) {
      setSelectedIdx(allTrainedModels.length - 1);
    }
  }, [allTrainedModels.length]);

  // If no models trained yet
  if (!allTrainedModels || allTrainedModels.length === 0) {
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

  const selected = allTrainedModels[selectedIdx];
  const result = selected.fullResult;
  const { metrics, confusion_matrix, model_used } = result;

  // When user selects a model, also update the global trainResults so Step 6/7 use it
  const handleSelect = (idx) => {
    setSelectedIdx(idx);
    setTrainResults(allTrainedModels[idx].fullResult);
  };

  return (
    <section className="screen active">
      <div className="screen-header">
        <div>
          <span className="step-tag">STEP 5 OF 7</span>
          <h2>Results — How Well Does the Model Perform?</h2>
          <p>
            Here we evaluate the model's predictions on the test patients it has
            never seen before. Select any trained model from the list to review.
          </p>
        </div>
        <div className="hdr-right">
          <button className="btn primary" onClick={onNext}>
            Next Step →
          </button>
        </div>
      </div>

      {/* MODEL SELECTOR LIST */}
      <div className="card" style={{ marginBottom: "15px" }}>
        <div className="card-title">
          Trained Models ({allTrainedModels.length}) — Select to View Details
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {allTrainedModels.map((m, i) => (
            <div
              key={m.id}
              onClick={() => handleSelect(i)}
              style={{
                cursor: "pointer",
                padding: "10px 16px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 600,
                transition: "all 0.15s ease",
                background: selectedIdx === i ? "var(--navy)" : "white",
                color: selectedIdx === i ? "#fff" : "var(--mid)",
                border: selectedIdx === i ? "2px solid var(--navy)" : "1px solid var(--line2)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                minWidth: "110px",
              }}
            >
              <span>{m.name}</span>
              <span style={{
                fontSize: "10px",
                opacity: selectedIdx === i ? 0.8 : 0.6,
                fontWeight: 400,
              }}>
                Acc: {m.accuracy}% · Sens: {m.sensitivity}%
              </span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "8px" }}>
          The selected model's results are shown below. The <b>last selected model</b> will be used for the remaining steps.
        </div>
      </div>

      <div className="cols">
        {/* LEFT COLUMN: METRICS AND ROC CURVE */}
        <div>
          <div className="card">
            <div className="card-title">
              Performance Metrics — {selected.name}
            </div>

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
                <div style={{ fontSize: "20px", fontWeight: 600, color: "var(--navy)" }}>
                  {metrics.accuracy}%
                </div>
                <div style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", marginTop: "4px" }}>
                  ACCURACY
                </div>
              </div>

              <div
                title="Of patients who WERE at risk, how many did the AI catch?"
                style={{
                  border: `1px solid ${metrics.sensitivity < 50 ? "rgba(185,28,28,.4)" : "rgba(13,122,80,.2)"}`,
                  background: metrics.sensitivity < 50 ? "#fef2f2" : "var(--good-bg)",
                  borderRadius: "8px",
                  padding: "10px 5px",
                  textAlign: "center",
                  cursor: "help",
                }}
              >
                <div style={{ fontSize: "20px", fontWeight: 600, color: metrics.sensitivity < 50 ? "var(--bad)" : "var(--good)" }}>
                  {metrics.sensitivity}%
                </div>
                <div style={{ fontSize: "9px", fontWeight: 600, color: metrics.sensitivity < 50 ? "var(--bad)" : "var(--good)", marginTop: "4px" }}>
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
                <div style={{ fontSize: "20px", fontWeight: 600, color: "var(--good)" }}>
                  {metrics.specificity}%
                </div>
                <div style={{ fontSize: "9px", fontWeight: 600, color: "var(--good)", marginTop: "4px" }}>
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
                <div style={{ fontSize: "20px", fontWeight: 600, color: "var(--navy)" }}>
                  {metrics.precision || 0}%
                </div>
                <div style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", marginTop: "4px" }}>
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
                <div style={{ fontSize: "20px", fontWeight: 600, color: "var(--navy)" }}>
                  {metrics.f1_score || 0}%
                </div>
                <div style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted)", marginTop: "4px" }}>
                  F1 SCORE
                </div>
              </div>
            </div>

            {/* DANGER BANNER: Sens < 50 */}
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
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
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
                <div title="Score for how well the model separates high-risk from low-risk patients overall." style={{ cursor: "help" }}>
                  <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--blue)" }}>
                    {metrics.auc}
                  </div>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted)" }}>
                    AUC SCORE
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--mid)", marginTop: "10px", lineHeight: 1.5 }}>
                    The closer the blue line is to the top-left corner (AUC =
                    1.0), the better the model distinguishes between safe and
                    high-risk patients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONFUSION MATRIX */}
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
              <div style={{ textAlign: "center", fontSize: "11px", fontWeight: 600, color: "var(--muted)" }}>
                Predicted: SAFE
              </div>
              <div style={{ textAlign: "center", fontSize: "11px", fontWeight: 600, color: "var(--muted)" }}>
                Predicted: RISK
              </div>

              <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", textAlign: "center", fontSize: "10px", fontWeight: 600, color: "var(--muted)" }}>
                Actual: SAFE
              </div>
              <div style={{ background: "var(--good-bg)", border: "1px solid rgba(13,122,80,.2)", borderRadius: "10px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "26px", fontWeight: 700, color: "var(--good)" }}>
                  {confusion_matrix.tn}
                </div>
                <div style={{ fontSize: "11px", color: "var(--good)", marginTop: "5px" }}>
                  ✅ True Negative
                </div>
              </div>
              <div style={{ background: "var(--warn-bg)", border: "1px solid rgba(160,92,0,.2)", borderRadius: "10px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "26px", fontWeight: 700, color: "var(--warn)" }}>
                  {confusion_matrix.fp}
                </div>
                <div style={{ fontSize: "11px", color: "var(--warn)", marginTop: "5px" }}>
                  ⚠️ False Positive
                </div>
              </div>

              <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", textAlign: "center", fontSize: "10px", fontWeight: 600, color: "var(--muted)" }}>
                Actual: RISK
              </div>
              <div style={{ background: "var(--bad-bg)", border: "1px solid rgba(185,28,28,.2)", borderRadius: "10px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "26px", fontWeight: 700, color: "var(--bad)" }}>
                  {confusion_matrix.fn}
                </div>
                <div style={{ fontSize: "11px", color: "var(--bad)", marginTop: "5px" }}>
                  ❌ False Negative
                </div>
              </div>
              <div style={{ background: "var(--good-bg)", border: "1px solid rgba(13,122,80,.2)", borderRadius: "10px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "26px", fontWeight: 700, color: "var(--good)" }}>
                  {confusion_matrix.tp}
                </div>
                <div style={{ fontSize: "11px", color: "var(--good)", marginTop: "5px" }}>
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

          {/* COMPARISON TABLE */}
          {allTrainedModels.length > 1 && (
            <div className="card" style={{ marginTop: "15px" }}>
              <div className="card-title">All Models Comparison</div>
              <div className="tbl-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Accuracy</th>
                      <th>Sensitivity ★</th>
                      <th>Specificity</th>
                      <th>F1</th>
                      <th>AUC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTrainedModels.map((m, i) => {
                      const isSelected = i === selectedIdx;
                      const isBest = m.sensitivity === Math.max(...allTrainedModels.map(x => x.sensitivity));
                      return (
                        <tr
                          key={m.id}
                          onClick={() => handleSelect(i)}
                          style={{
                            cursor: "pointer",
                            background: isSelected ? "rgba(13,35,64,0.06)" : "transparent",
                            borderLeft: isSelected ? "3px solid var(--navy)" : "3px solid transparent",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <td style={{ fontWeight: isSelected ? 700 : 500 }}>
                            {m.name}
                            {isBest && allTrainedModels.length > 1 && (
                              <span style={{
                                marginLeft: "6px",
                                fontSize: "9px",
                                background: "var(--good-bg)",
                                color: "var(--good)",
                                padding: "2px 6px",
                                borderRadius: "8px",
                                fontWeight: 600,
                              }}>
                                BEST
                              </span>
                            )}
                          </td>
                          <td>{m.accuracy}%</td>
                          <td style={{
                            color: m.sensitivity < 70 ? "var(--bad)" : "var(--good)",
                            fontWeight: 600,
                          }}>
                            {m.sensitivity}%
                          </td>
                          <td>{m.specificity}%</td>
                          <td>{m.f1_score}%</td>
                          <td>{m.auc}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
