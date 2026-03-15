import React, { useState } from "react";

export default function Step7({ onPrev }) {
  const [checklist, setChecklist] = useState([
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const toggleCheck = (i) => {
    const nw = [...checklist];
    nw[i] = !nw[i];
    setChecklist(nw);
  };

  return (
    <section className="screen active">
      <div className="screen-header">
        <div>
          <span className="step-tag">STEP 7 OF 7</span>
          <h2>Ethics & Bias — Is This Model Fair for All Patients?</h2>
          <p>
            Before any AI tool is used in a hospital, it must be checked for
            fairness across different patient groups. A model that works well on
            average but poorly for elderly or female patients is not safe to
            deploy.
          </p>
        </div>
        <div className="hdr-right">
          <button className="btn teal">📄 Download Summary Certificate</button>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}
      >
        {/* SOL KOLON */}
        <div>
          <div className="card">
            <div className="card-title">
              Subgroup Performance — Is the Model Fair?
            </div>
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Patient Group</th>
                    <th>Accuracy</th>
                    <th>Sensitivity</th>
                    <th>Specificity</th>
                    <th>Fairness</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Male</td>
                    <td>81%</td>
                    <td style={{ color: "var(--good)", fontWeight: 600 }}>
                      67%
                    </td>
                    <td>88%</td>
                    <td>
                      <span className="tag good">OK</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Female</td>
                    <td>73%</td>
                    <td style={{ color: "var(--bad)", fontWeight: 600 }}>
                      41%
                    </td>
                    <td>83%</td>
                    <td>
                      <span
                        className="tag bad"
                        style={{ background: "#fef2f2", color: "#991b1b" }}
                      >
                        ⚠ Review Needed
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Age 18–60</td>
                    <td>80%</td>
                    <td style={{ color: "var(--good)", fontWeight: 600 }}>
                      65%
                    </td>
                    <td>87%</td>
                    <td>
                      <span className="tag good">OK</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Age 61–75</td>
                    <td>77%</td>
                    <td style={{ color: "var(--warn)", fontWeight: 600 }}>
                      58%
                    </td>
                    <td>84%</td>
                    <td>
                      <span
                        className="tag warn"
                        style={{ background: "#fffbeb", color: "#92400e" }}
                      >
                        Review
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Age 76+</td>
                    <td>71%</td>
                    <td style={{ color: "var(--bad)", fontWeight: 600 }}>
                      39%
                    </td>
                    <td>80%</td>
                    <td>
                      <span
                        className="tag bad"
                        style={{ background: "#fef2f2", color: "#991b1b" }}
                      >
                        ⚠ Review Needed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              className="banner bad"
              style={{
                marginTop: "15px",
                background: "#fef2f2",
                borderColor: "#fca5a5",
                color: "#991b1b",
              }}
            >
              <div className="banner-icon">🚨</div>
              <div>
                <b>Bias Detected:</b> Sensitivity for female patients (41%) is
                26 percentage points lower than for male patients (67%). This
                means the model misses far more readmissions in women.{" "}
                <b>
                  This model should NOT be deployed until this gap is addressed.
                </b>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              Training Data Representation vs. Real Patient Population
            </div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--muted)",
                marginBottom: "8px",
              }}
            >
              TRAINING DATA
            </div>
            <div className="bars" style={{ display: "grid", gap: "10px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "100px",
                    fontSize: "12px",
                    color: "var(--mid)",
                    textAlign: "right",
                  }}
                >
                  Male patients
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
                      width: "65%",
                      height: "100%",
                      borderRadius: "999px",
                      background: "var(--navy)",
                    }}
                  ></div>
                </div>
                <div
                  style={{ width: "30px", fontSize: "12px", fontWeight: 600 }}
                >
                  65%
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "100px",
                    fontSize: "12px",
                    color: "var(--mid)",
                    textAlign: "right",
                  }}
                >
                  Female patients
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
                      width: "35%",
                      height: "100%",
                      borderRadius: "999px",
                      background: "#d97706",
                    }}
                  ></div>
                </div>
                <div
                  style={{ width: "30px", fontSize: "12px", fontWeight: 600 }}
                >
                  35%
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--muted)",
                margin: "20px 0 8px",
              }}
            >
              REAL HOSPITAL POPULATION
            </div>
            <div className="bars" style={{ display: "grid", gap: "10px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "100px",
                    fontSize: "12px",
                    color: "var(--mid)",
                    textAlign: "right",
                  }}
                >
                  Male patients
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
                      width: "48%",
                      height: "100%",
                      borderRadius: "999px",
                      background: "var(--navy)",
                    }}
                  ></div>
                </div>
                <div
                  style={{ width: "30px", fontSize: "12px", fontWeight: 600 }}
                >
                  48%
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "100px",
                    fontSize: "12px",
                    color: "var(--mid)",
                    textAlign: "right",
                  }}
                >
                  Female patients
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
                      width: "52%",
                      height: "100%",
                      borderRadius: "999px",
                      background: "var(--teal)",
                    }}
                  ></div>
                </div>
                <div
                  style={{ width: "30px", fontSize: "12px", fontWeight: 600 }}
                >
                  52%
                </div>
              </div>
            </div>

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
                <b>Under-representation:</b> Only 35% of training patients were
                female, but 52% of real patients are female. This mismatch
                explains the model's poor performance for women. Retrain with a
                more balanced dataset.
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ KOLON */}
        <div>
          <div className="card">
            <div className="card-title">EU AI Act Compliance Checklist</div>
            <div style={{ display: "grid", gap: "8px" }}>
              {[
                {
                  t: "Model is explainable (outputs have reasons)",
                  d: "We implemented feature importance and per-patient explanations in Step 6",
                },
                {
                  t: "Training data is documented",
                  d: "Dataset source, size, time period, and patient demographics are recorded",
                },
                {
                  t: "Subgroup bias audit completed",
                  d: "Performance gaps between male/female and age groups must be addressed before deployment",
                },
                {
                  t: "Human oversight plan defined",
                  d: "A qualified clinician must review all high-risk flags before any action is taken",
                },
                {
                  t: "Patient data privacy protected",
                  d: "GDPR compliant: no personally identifiable information used in model training",
                },
                {
                  t: "Drift monitoring plan established",
                  d: "Model accuracy must be re-checked every 3 months as patient population changes",
                },
                {
                  t: "Incident reporting pathway defined",
                  d: "If the model causes harm, there is a clear process for reporting and review",
                },
                {
                  t: "Clinical validation completed",
                  d: "Model tested in real clinical environment with supervision before full deployment",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => toggleCheck(i)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid",
                    cursor: "pointer",
                    borderColor: checklist[i]
                      ? "rgba(13,122,80,.3)"
                      : "var(--line)",
                    background: checklist[i] ? "#f0fdf4" : "#fff",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "6px",
                      border: "2px solid",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "12px",
                      borderColor: checklist[i]
                        ? "var(--teal)"
                        : "var(--line2)",
                      background: checklist[i] ? "var(--teal)" : "#fff",
                      color: "#fff",
                    }}
                  >
                    {checklist[i] ? "✓" : ""}
                  </div>
                  <div>
                    <b
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: checklist[i] ? "#166534" : "var(--ink)",
                      }}
                    >
                      {item.t}
                    </b>
                    <small
                      style={{
                        display: "block",
                        fontSize: "11px",
                        color: checklist[i] ? "#15803d" : "var(--muted)",
                        marginTop: "3px",
                      }}
                    >
                      {item.d}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              Real-World AI Failures in Healthcare — What Goes Wrong
            </div>
            <div style={{ display: "grid", gap: "10px" }}>
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fca5a5",
                  padding: "15px",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#991b1b",
                    marginBottom: "5px",
                  }}
                >
                  ⚠ Case 1: Sepsis Algorithm Bias
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#7f1d1d",
                    lineHeight: 1.5,
                  }}
                >
                  An ICU sepsis prediction algorithm was found to perform
                  significantly worse for Black patients because it was trained
                  mostly on data from white patients. Hospitals had to suspend
                  the tool and retrain it with representative data.
                </div>
              </div>
              <div
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  padding: "15px",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#92400e",
                    marginBottom: "5px",
                  }}
                >
                  ⚠ Case 2: Accuracy ≠ Safety
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#78350f",
                    lineHeight: 1.5,
                  }}
                >
                  A readmission model with 85% overall accuracy was deployed but
                  had only 30% sensitivity for elderly patients — the
                  highest-risk group. The hospital reported more missed
                  readmissions after deploying the AI than before.
                </div>
              </div>
              <div
                style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  padding: "15px",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#1e40af",
                    marginBottom: "5px",
                  }}
                >
                  ✅ How to Prevent This
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#1e3a8a",
                    lineHeight: 1.5,
                  }}
                >
                  Always check subgroup performance. Always require human
                  review. Always retrain periodically. Never deploy based on
                  overall accuracy alone.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KAPANIŞ BANNER'I */}
      <div
        className="banner good"
        style={{
          marginTop: "15px",
          background: "#ecfdf5",
          borderColor: "#86d4a7",
          padding: "20px",
        }}
      >
        <div className="banner-icon" style={{ fontSize: "24px" }}>
          🎓
        </div>
        <div>
          <b style={{ color: "#065f46", fontSize: "14px" }}>
            Congratulations — you have completed all 7 steps.
          </b>
          <span
            style={{ color: "#166534", display: "block", marginTop: "5px" }}
          >
            You have defined a clinical problem, explored patient data, prepared
            it correctly, trained and compared ML models, evaluated results with
            clinical metrics, understood why the model makes predictions, and
            checked it for fairness. Download your Summary Certificate to
            document what you built.
          </span>
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
        <button className="btn teal">📄 Download Summary Certificate</button>
      </div>
    </section>
  );
}
