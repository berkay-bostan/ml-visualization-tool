import React, { useState } from "react";

export default function Step6({ onNext, onPrev }) {
  const [selectedPatient, setSelectedPatient] = useState("Patient #47");

  return (
    <section className="screen active">
      <div className="screen-header">
        <div>
          <span className="step-tag">STEP 6 OF 7</span>
          <h2>Explainability — Why Did the Model Make This Prediction?</h2>
          <p>
            A model that cannot explain itself should not be trusted in clinical
            settings. Here we look at which patient measurements were most
            important.
          </p>
        </div>
        <div className="hdr-right">
          <button className="btn primary" onClick={onNext}>
            Next Step →
          </button>
        </div>
      </div>

      <div className="cols">
        {/* SOL TARAF: GENEL ÖZELLİK ÖNEMİ */}
        <div>
          <div className="card">
            <div className="card-title">
              Most Important Patient Measurements (Overall)
            </div>
            <div className="bars" style={{ display: "grid", gap: "9px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "150px",
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
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "82%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg,var(--navy),var(--blue))",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    width: "44px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--mid)",
                  }}
                >
                  0.28
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "150px",
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
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "66%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg,var(--navy),var(--blue))",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    width: "44px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--mid)",
                  }}
                >
                  0.22
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "150px",
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
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "54%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg,var(--navy),var(--blue))",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    width: "44px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--mid)",
                  }}
                >
                  0.17
                </div>
              </div>
            </div>
            <div className="banner info" style={{ marginTop: "15px" }}>
              <div className="banner-icon">💡</div>
              <div>
                <b>Clinical sense check:</b> Ejection fraction and creatinine
                are the top predictors. This makes strong clinical sense.
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Single Patient Explanation</div>
            <label className="lbl">Select a Test Patient</label>
            <select
              className="sel"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            >
              <option>Patient #47 · Age 71 · EF 20% · HIGH RISK</option>
              <option>Patient #12 · Age 45 · EF 55% · LOW RISK</option>
            </select>
            <button
              className="btn teal"
              style={{ width: "100%", marginTop: "10px" }}
            >
              Explain This Patient →
            </button>
          </div>
        </div>

        {/* SAĞ TARAF: TEK HASTA AÇIKLAMASI (WATERFALL CHART MANTIĞI) */}
        <div>
          <div className="card">
            <div className="card-title">
              Why Was {selectedPatient.split("·")[0]} Flagged? (78% probability)
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--mid)",
                marginBottom: "15px",
              }}
            >
              Each bar shows how much a measurement pushed the prediction toward
              or away from readmission.
            </div>

            <div className="bars" style={{ display: "grid", gap: "9px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "150px",
                    fontSize: "12px",
                    color: "var(--bad)",
                    textAlign: "right",
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
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "80%",
                      height: "100%",
                      background: "linear-gradient(90deg,var(--bad),#ef4444)",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    width: "44px",
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
                    width: "150px",
                    fontSize: "12px",
                    color: "var(--bad)",
                    textAlign: "right",
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
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "58%",
                      height: "100%",
                      background: "linear-gradient(90deg,var(--bad),#ef4444)",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    width: "44px",
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
                    width: "150px",
                    fontSize: "12px",
                    color: "var(--good)",
                    textAlign: "right",
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
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "20%",
                      height: "100%",
                      background: "linear-gradient(90deg,var(--teal),#18c9b4)",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    width: "44px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--good)",
                  }}
                >
                  -0.05
                </div>
              </div>
            </div>

            <div className="banner warn" style={{ marginTop: "15px" }}>
              <div className="banner-icon">⚠️</div>
              <div>
                <b>Important:</b> These are associations, not causes. A
                clinician must decide whether and how to act.
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
