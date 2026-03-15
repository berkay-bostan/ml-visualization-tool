import React from "react";

export default function Step1({ selectedDomain, onNext }) {
  if (!selectedDomain) return null;

  return (
    <section className="screen active">
      <div className="screen-header">
        <div>
          <span className="step-tag">STEP 1 OF 7</span>
          <h2>Clinical Context & Problem Definition</h2>
          <p>
            Before we look at any data, we define the clinical problem. In{" "}
            <b>{selectedDomain}</b>, we want to predict which patients are most
            likely to be readmitted to hospital within 30 days after a heart
            failure discharge — so doctors can arrange follow-up care in
            advance.
          </p>
        </div>
        <div className="hdr-right">
          <div
            style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 600 }}
          >
            ⏱ ~3 minutes
          </div>
          <button className="btn primary" onClick={onNext}>
            Next Step →
          </button>
        </div>
      </div>

      <div className="cols">
        {/* SOL KOLON */}
        <div>
          <div className="card">
            <div className="card-title">Clinical Scenario</div>
            <label className="lbl">Domain</label>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--navy)",
                padding: "8px 0",
              }}
            >
              {selectedDomain}
            </div>

            <label className="lbl">Clinical Question</label>
            <div
              style={{
                fontSize: "13px",
                color: "var(--mid)",
                lineHeight: 1.6,
                padding: "10px 12px",
                background: "var(--sky)",
                borderRadius: "10px",
                border: "1px solid var(--line2)",
              }}
            >
              Will this patient be readmitted to hospital within 30 days of
              discharge following a heart failure episode?
            </div>

            <label className="lbl">Why This Matters</label>
            <div
              style={{ fontSize: "13px", color: "var(--mid)", lineHeight: 1.6 }}
            >
              30% of heart failure patients are readmitted within 30 days. Each
              readmission costs approximately €15,000. Early identification
              allows nurses to arrange discharge follow-up calls and medication
              checks.
            </div>

            <div className="banner warn" style={{ marginTop: "15px" }}>
              <div className="banner-icon">⚠️</div>
              <div>
                <b>What ML cannot do:</b> It cannot replace your clinical
                judgment. It can flag high-risk patients, but you make the final
                decision.
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ KOLON */}
        <div>
          <div className="card">
            <div className="card-title">What Will Be Produced in Each Step</div>
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Step</th>
                    <th>What You Will Create</th>
                    <th>Plain English Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="tag info">1</span>
                    </td>
                    <td>Clinical Brief</td>
                    <td>The problem we are solving, and the safety rules</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="tag info">2</span>
                    </td>
                    <td>Data Profile</td>
                    <td>
                      Understanding your patient dataset — who is in it and what
                      is missing
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="tag info">3</span>
                    </td>
                    <td>Preprocessing Recipe</td>
                    <td>
                      Cleaning and preparing data so the model can learn
                      correctly
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="tag info">4</span>
                    </td>
                    <td>Trained Model</td>
                    <td>
                      A computer programme that has learned patterns from past
                      patients
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="tag info">5</span>
                    </td>
                    <td>Evaluation Report</td>
                    <td>How accurately does the model predict readmission?</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="tag info">6</span>
                    </td>
                    <td>Explanation</td>
                    <td>
                      Why did the model flag a specific patient as high risk?
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="tag info">7</span>
                    </td>
                    <td>Ethics Checklist</td>
                    <td>
                      Is the model fair for all patient groups? Who oversees it?
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              className="banner good"
              style={{
                marginTop: "12px",
                background: "#eefbf4",
                borderColor: "#86d4a7",
              }}
            >
              <div className="banner-icon">✅</div>
              <div style={{ color: "#166534" }}>
                <b>Remember:</b> A human doctor or nurse must always review the
                model's suggestions. This tool helps you learn — it does not
                make clinical decisions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
