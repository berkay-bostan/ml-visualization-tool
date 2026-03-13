import React, { useState } from "react";

export default function Step7({ onPrev }) {
  // Checklist durumlarını tutan state (İlk ikisi otomatik işaretli)
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

  const toggleCheck = (index) => {
    const newChecklist = [...checklist];
    newChecklist[index] = !newChecklist[index];
    setChecklist(newChecklist);
  };

  const checkItems = [
    {
      title: "Model is explainable",
      desc: "We implemented feature importance in Step 6",
    },
    {
      title: "Training data is documented",
      desc: "Dataset source and demographics are recorded",
    },
    {
      title: "Subgroup bias audit completed",
      desc: "Performance gaps must be addressed",
    },
    {
      title: "Human oversight plan defined",
      desc: "A clinician must review all high-risk flags",
    },
    {
      title: "Patient data privacy protected",
      desc: "GDPR compliant: no identifiable info used",
    },
    {
      title: "Drift monitoring plan established",
      desc: "Accuracy must be re-checked every 3 months",
    },
    {
      title: "Incident reporting pathway defined",
      desc: "Clear process for reporting AI-related errors",
    },
    {
      title: "Clinical validation completed",
      desc: "Tested in real environment before full deployment",
    },
  ];

  return (
    <section className="screen active">
      <div className="screen-header">
        <div>
          <span className="step-tag">STEP 7 OF 7</span>
          <h2>Ethics & Bias — Is This Model Fair for All Patients?</h2>
          <p>
            Before any AI tool is used, it must be checked for fairness across
            different patient groups.
          </p>
        </div>
        <div className="hdr-right">
          <button className="btn teal">📄 Download Certificate</button>
        </div>
      </div>

      <div
        className="cols wide"
        style={{ gridTemplateColumns: "1fr", gap: "15px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          {/* SOL: ALT GRUP PERFORMANSI */}
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
                    <td>
                      <span className="tag bad">⚠ Review Needed</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Age 18–60</td>
                    <td>80%</td>
                    <td style={{ color: "var(--good)", fontWeight: 600 }}>
                      65%
                    </td>
                    <td>
                      <span className="tag good">OK</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Age 76+</td>
                    <td>71%</td>
                    <td style={{ color: "var(--bad)", fontWeight: 600 }}>
                      39%
                    </td>
                    <td>
                      <span className="tag bad">⚠ Review Needed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="banner bad" style={{ marginTop: "15px" }}>
              <div className="banner-icon">🚨</div>
              <div>
                <b>Bias Detected:</b> Sensitivity for female patients is
                significantly lower. This model should NOT be deployed until
                this gap is addressed.
              </div>
            </div>
          </div>

          {/* SAĞ: EU AI ACT CHECKLIST */}
          <div className="card">
            <div className="card-title">EU AI Act Compliance Checklist</div>
            <div style={{ display: "grid", gap: "8px" }}>
              {checkItems.map((item, i) => (
                <div
                  key={i}
                  onClick={() => toggleCheck(i)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid",
                    cursor: "pointer",
                    transition: ".15s",
                    borderColor: checklist[i]
                      ? "rgba(13,122,80,.3)"
                      : "var(--line)",
                    background: checklist[i]
                      ? "var(--good-bg)"
                      : "var(--white)",
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
                      fontSize: "11px",
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
                        color: "var(--ink)",
                      }}
                    >
                      {item.title}
                    </b>
                    <small
                      style={{
                        display: "block",
                        fontSize: "11px",
                        color: "var(--muted)",
                        marginTop: "2px",
                      }}
                    >
                      {item.desc}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="banner good" style={{ marginTop: "5px" }}>
          <div className="banner-icon">🎓</div>
          <div>
            <b>Congratulations — you have completed all 7 steps.</b> You have
            explored data, trained ML models, and checked for fairness.
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
        <button className="btn teal">📄 Download Summary Certificate</button>
      </div>
    </section>
  );
}
