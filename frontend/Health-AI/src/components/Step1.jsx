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
            <b>{selectedDomain}</b>, we want to predict the outcome so
            clinicians can act early.
          </p>
        </div>
        <div className="hdr-right">
          <button className="btn primary" onClick={onNext}>
            Next Step →
          </button>
        </div>
      </div>

      <div className="cols">
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
                </tbody>
              </table>
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
          justifyContent: "flex-end",
        }}
      >
        <button className="btn primary" onClick={onNext}>
          Next Step →
        </button>
      </div>
    </section>
  );
}
