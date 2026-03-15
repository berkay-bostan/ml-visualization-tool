import React from "react";

export default function Step6({ onNext, onPrev }) {
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

      <div className="cols">
        {/* SOL KOLON */}
        <div>
          <div className="card">
            <div className="card-title">
              Most Important Patient Measurements (Overall)
            </div>
            <div className="bars" style={{ display: "grid", gap: "12px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "120px",
                    fontSize: "12px",
                    color: "var(--mid)",
                    textAlign: "right",
                  }}
                >
                  Ejection Fraction
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
                      width: "82%",
                      height: "100%",
                      borderRadius: "999px",
                      background: "var(--navy)",
                    }}
                  ></div>
                </div>
                <div
                  style={{ width: "30px", fontSize: "12px", fontWeight: 600 }}
                >
                  0.28
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "120px",
                    fontSize: "12px",
                    color: "var(--mid)",
                    textAlign: "right",
                  }}
                >
                  Serum Creatinine
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
                      width: "66%",
                      height: "100%",
                      borderRadius: "999px",
                      background: "var(--navy)",
                    }}
                  ></div>
                </div>
                <div
                  style={{ width: "30px", fontSize: "12px", fontWeight: 600 }}
                >
                  0.22
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "120px",
                    fontSize: "12px",
                    color: "var(--mid)",
                    textAlign: "right",
                  }}
                >
                  Age
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
                      width: "54%",
                      height: "100%",
                      borderRadius: "999px",
                      background: "var(--navy)",
                    }}
                  ></div>
                </div>
                <div
                  style={{ width: "30px", fontSize: "12px", fontWeight: 600 }}
                >
                  0.17
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "120px",
                    fontSize: "12px",
                    color: "var(--mid)",
                    textAlign: "right",
                  }}
                >
                  Time in Hospital
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
                      width: "40%",
                      height: "100%",
                      borderRadius: "999px",
                      background: "var(--navy)",
                    }}
                  ></div>
                </div>
                <div
                  style={{ width: "30px", fontSize: "12px", fontWeight: 600 }}
                >
                  0.13
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "120px",
                    fontSize: "12px",
                    color: "var(--mid)",
                    textAlign: "right",
                  }}
                >
                  Serum Sodium
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
                      width: "28%",
                      height: "100%",
                      borderRadius: "999px",
                      background: "var(--navy)",
                    }}
                  ></div>
                </div>
                <div
                  style={{ width: "30px", fontSize: "12px", fontWeight: 600 }}
                >
                  0.09
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "120px",
                    fontSize: "12px",
                    color: "var(--mid)",
                    textAlign: "right",
                  }}
                >
                  Smoking Status
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
                      width: "16%",
                      height: "100%",
                      borderRadius: "999px",
                      background: "var(--navy)",
                    }}
                  ></div>
                </div>
                <div
                  style={{ width: "30px", fontSize: "12px", fontWeight: 600 }}
                >
                  0.05
                </div>
              </div>
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
                <b>Clinical sense check:</b> Ejection fraction (how well the
                heart pumps) and creatinine (kidney function) are the top
                predictors. This makes strong clinical sense — both are
                established readmission risk factors in heart failure.
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Single Patient Explanation</div>
            <label className="lbl">Select a Test Patient</label>
            <select className="sel">
              <option>
                Patient #47 · Age 71 · Ejection Fraction 20% · Pr...
              </option>
            </select>
            <button
              className="btn teal"
              style={{ width: "100%", marginTop: "12px" }}
            >
              Explain This Patient →
            </button>
          </div>
        </div>

        {/* SAĞ KOLON */}
        <div>
          <div className="card">
            <div className="card-title">
              Why Was Patient #47 Flagged as HIGH RISK? (78% probability)
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--mid)",
                marginBottom: "20px",
              }}
            >
              Each bar shows how much a measurement pushed the prediction toward
              or away from readmission. The longer the bar, the stronger the
              effect.
            </div>

            <div className="bars" style={{ display: "grid", gap: "12px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "130px",
                    fontSize: "12px",
                    color: "var(--bad)",
                    textAlign: "right",
                    fontWeight: 500,
                  }}
                >
                  ↑ EF very low (20%)
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
                      width: "85%",
                      height: "100%",
                      borderRadius: "999px",
                      background: "var(--bad)",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    width: "40px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--bad)",
                  }}
                >
                  +0.24
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "130px",
                    fontSize: "12px",
                    color: "var(--bad)",
                    textAlign: "right",
                    fontWeight: 500,
                  }}
                >
                  ↑ Age 71
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
                      width: "60%",
                      height: "100%",
                      borderRadius: "999px",
                      background: "var(--bad)",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    width: "40px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--bad)",
                  }}
                >
                  +0.16
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "130px",
                    fontSize: "12px",
                    color: "var(--bad)",
                    textAlign: "right",
                    fontWeight: 500,
                  }}
                >
                  ↑ Creatinine 2.1
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
                      width: "45%",
                      height: "100%",
                      borderRadius: "999px",
                      background: "var(--bad)",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    width: "40px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--bad)",
                  }}
                >
                  +0.12
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "130px",
                    fontSize: "12px",
                    color: "var(--good)",
                    textAlign: "right",
                    fontWeight: 500,
                  }}
                >
                  ↓ Non-smoker
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
                      width: "20%",
                      height: "100%",
                      borderRadius: "999px",
                      background: "var(--teal)",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    width: "40px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--good)",
                  }}
                >
                  -0.05
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "130px",
                    fontSize: "12px",
                    color: "var(--good)",
                    textAlign: "right",
                    fontWeight: 500,
                  }}
                >
                  ↓ Sodium normal
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
                      width: "15%",
                      height: "100%",
                      borderRadius: "999px",
                      background: "var(--teal)",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    width: "40px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--good)",
                  }}
                >
                  -0.03
                </div>
              </div>
            </div>

            <div
              className="banner warn"
              style={{
                marginTop: "25px",
                background: "#fffbeb",
                borderColor: "#fde68a",
              }}
            >
              <div className="banner-icon">⚠️</div>
              <div style={{ color: "#92400e" }}>
                <b>Important:</b> These are associations, not causes. The model
                says ejection fraction is important for this prediction — a
                cardiologist must decide whether and how to act.
              </div>
            </div>

            <div
              className="banner info"
              style={{
                marginTop: "10px",
                background: "#eff6ff",
                borderColor: "#bfdbfe",
              }}
            >
              <div className="banner-icon">💡</div>
              <div style={{ color: "#1e40af" }}>
                <b>What-if:</b> What if this patient's creatinine were 1.2
                instead of 2.1? The predicted risk would drop to approximately
                61%. This kind of thinking helps assess which interventions
                might help.
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
