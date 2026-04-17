import React, { useState, useEffect } from "react";

export default function Step7({ onPrev, trainResults, file, targetColumn, datasetInfo, selectedDomain }) {
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

  const checklistItems = [
    "Model is explainable (outputs have reasons)",
    "Training data is documented",
    "Subgroup bias audit completed",
    "Human oversight plan defined",
    "Patient data privacy protected",
    "GDPR compliant: no personally identifiable information used in model training",
    "Drift monitoring plan established",
    "Model accuracy must be re-checked every 3 months as patient population changes",
    "Incident reporting pathway defined",
    "If the model causes harm, there is a clear process for reporting and review",
    "Clinical validation completed",
    "Model tested in real clinical environment with supervision before full deployment",
  ];

  const toggleCheck = (i) => {
    const nw = [...checklist];
    nw[i] = !nw[i];
    setChecklist(nw);
  };

  // --- BIAS ANALYSIS STATE ---
  const [biasData, setBiasData] = useState(null);
  const [biasLoading, setBiasLoading] = useState(false);
  const [biasError, setBiasError] = useState(null);
  const [selectedSubgroupCol, setSelectedSubgroupCol] = useState("");

  // --- TRAINING DISTRIBUTION STATE ---
  const [distData, setDistData] = useState(null);
  const [distLoading, setDistLoading] = useState(false);
  const [distError, setDistError] = useState(null);
  const [selectedDistCol, setSelectedDistCol] = useState("");

  // --- PDF DOWNLOAD STATE ---
  const [pdfLoading, setPdfLoading] = useState(false);

  // Build the list of candidate columns for the demographic dropdown
  const allColumns = datasetInfo?.columns || [];
  const candidateColumns = allColumns.filter((col) => col !== targetColumn);

  // Fetch bias analysis from backend
  const fetchBias = async (subgroupCol) => {
    if (!file || !targetColumn || !subgroupCol) return;
    setBiasLoading(true);
    setBiasError(null);
    setBiasData(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_column", targetColumn);
    formData.append("subgroup_column", subgroupCol);

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL || ""}/bias`, {
        method: "POST",
        body: formData,
      });
      const data = await resp.json();
      if (data.status === "success") {
        setBiasData(data);
      } else {
        setBiasError(data.message);
      }
    } catch (err) {
      setBiasError("Could not connect to backend. Is FastAPI running?");
    } finally {
      setBiasLoading(false);
    }
  };

  const handleSubgroupChange = (e) => {
    const col = e.target.value;
    setSelectedSubgroupCol(col);
    fetchBias(col);
  };

  // Fetch training distribution from backend
  const fetchDistribution = async (demoCol) => {
    if (!file || !targetColumn || !demoCol) return;
    setDistLoading(true);
    setDistError(null);
    setDistData(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_column", targetColumn);
    formData.append("demographic_column", demoCol);

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL || ""}/training-distribution`, {
        method: "POST",
        body: formData,
      });
      const data = await resp.json();
      if (data.status === "success") {
        setDistData(data);
      } else {
        setDistError(data.message);
      }
    } catch (err) {
      setDistError("Could not connect to backend. Is FastAPI running?");
    } finally {
      setDistLoading(false);
    }
  };

  const handleDistColChange = (e) => {
    const col = e.target.value;
    setSelectedDistCol(col);
    fetchDistribution(col);
  };

  const metrics = trainResults?.metrics || {};
  const acc = metrics.accuracy || "—";
  const sens = metrics.sensitivity || "—";
  const spec = metrics.specificity || "—";
  const auc = metrics.auc || "—";
  const prec = metrics.precision || "—";
  const f1 = metrics.f1_score || "—";
  const modelUsed = trainResults?.model_used?.toUpperCase() || "—";

  // Completion count
  const completed = checklist.filter(Boolean).length;
  const total = checklist.length;

  // 📄 DOWNLOAD CERTIFICATE (Real PDF via Backend)
  const downloadCertificate = async () => {
    setPdfLoading(true);
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const timeStr = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Build checklist items with status
    const checklistPayload = [
      "Model is explainable (outputs have reasons)",
      "Training data is documented",
      "Subgroup bias audit completed",
      "Human oversight plan defined",
      "Patient data privacy protected",
      "Drift monitoring plan established",
      "Incident reporting pathway defined",
      "Clinical validation completed",
    ].map((text, i) => ({
      text,
      checked: checklist[i] || false,
    }));

    const payload = {
      domain: selectedDomain || "Unknown",
      model_used: modelUsed,
      metrics: metrics,
      checklist_items: checklistPayload,
      bias_data: biasData || null,
      date: `${dateStr} at ${timeStr}`,
      completed_count: completed,
      total_count: total,
    };

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/generate-certificate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `HEALTH-AI_Certificate_${now.toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Could not generate PDF certificate. Is the backend running?");
      console.error(err);
    } finally {
      setPdfLoading(false);
    }
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
          <button
            className="btn teal"
            onClick={downloadCertificate}
            disabled={pdfLoading}
          >
            {pdfLoading ? "⏳ Generating PDF..." : "📄 Download Summary Certificate"}
          </button>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}
      >
        {/* LEFT COLUMN */}
        <div>
          <div className="card">
            <div className="card-title">
              Model Performance & Subgroup Bias Audit
            </div>

            {trainResults ? (
              <>
                <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                  <div style={{ flex: 1, textAlign: "center", padding: "15px", borderRadius: "10px", border: "1px solid var(--line)", background: "#f8fafc" }}>
                    <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--navy)" }}>{acc}%</div>
                    <div style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase", marginTop: "4px" }}>Accuracy</div>
                  </div>
                  <div style={{ flex: 1, textAlign: "center", padding: "15px", borderRadius: "10px", border: `1px solid ${sens !== "—" && sens < 60 ? "#fca5a5" : "var(--line)"}`, background: sens !== "—" && sens < 60 ? "#fef2f2" : "#f8fafc" }}>
                    <div style={{ fontSize: "24px", fontWeight: "bold", color: sens !== "—" && sens < 60 ? "var(--bad)" : "var(--navy)" }}>{sens}%</div>
                    <div style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase", marginTop: "4px" }}>Overall Sensitivity</div>
                  </div>
                  <div style={{ flex: 1, textAlign: "center", padding: "15px", borderRadius: "10px", border: "1px solid var(--line)", background: "#f8fafc" }}>
                    <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--navy)" }}>{spec}%</div>
                    <div style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase", marginTop: "4px" }}>Specificity</div>
                  </div>
                </div>

                {/* SUBGROUP COLUMN SELECTOR */}
                <div style={{ marginBottom: "15px" }}>
                  <label
                    className="lbl"
                    style={{ marginBottom: "6px", display: "block" }}
                  >
                    Which demographic feature would you like to audit for
                    fairness?
                  </label>
                  <select
                    className="sel"
                    value={selectedSubgroupCol}
                    onChange={handleSubgroupChange}
                    style={{ width: "100%" }}
                  >
                    <option value="" disabled>
                      — Select a column to audit —
                    </option>
                    {candidateColumns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--muted)",
                      marginTop: "4px",
                    }}
                  >
                    Choose a column like gender, age group, or ethnicity to check
                    if the model treats all patient groups fairly.
                  </div>
                </div>

                {/* BIAS LOADING */}
                {biasLoading && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "var(--mid)",
                    }}
                  >
                    ⏳ Analysing subgroup performance...
                  </div>
                )}

                {/* BIAS ERROR */}
                {biasError && (
                  <div
                    className="banner bad"
                    style={{ marginBottom: "15px" }}
                  >
                    <div className="banner-icon">❌</div>
                    <div>{biasError}</div>
                  </div>
                )}

                {/* BIAS AUTO-DETECTION BANNER */}
                {biasData?.bias_detected && (
                  <div
                    className="banner bad"
                    style={{
                      background: "#fef2f2",
                      borderColor: "#fca5a5",
                      color: "#991b1b",
                      marginBottom: "15px",
                    }}
                  >
                    <div className="banner-icon">🚨</div>
                    <div>
                      <b>Bias Auto-Detection:</b> {biasData.bias_message}
                    </div>
                  </div>
                )}

                {/* SUBGROUP TABLE */}
                {biasData && !biasLoading && (
                  <>
                    <h4
                      style={{
                        fontSize: "12px",
                        color: "var(--navy)",
                        marginBottom: "8px",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      Subgroup Fairness Audit — Column: {biasData.subgroup_column}
                    </h4>
                    <table
                      style={{
                        width: "100%",
                        fontSize: "12px",
                        textAlign: "left",
                        marginBottom: "20px",
                        borderCollapse: "collapse",
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            borderBottom: "1px solid var(--line)",
                            color: "var(--muted)",
                          }}
                        >
                          <th style={{ padding: "8px" }}>Group</th>
                          <th style={{ padding: "8px" }}>Cases</th>
                          <th style={{ padding: "8px" }}>Accuracy</th>
                          <th style={{ padding: "8px" }}>Sensitivity</th>
                          <th style={{ padding: "8px" }}>Specificity</th>
                          <th style={{ padding: "8px" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Overall row */}
                        <tr
                          style={{
                            borderBottom: "2px solid var(--navy)",
                            background: "#f0f4f8",
                            fontWeight: 600,
                          }}
                        >
                          <td style={{ padding: "8px" }}>Overall</td>
                          <td style={{ padding: "8px" }}>—</td>
                          <td style={{ padding: "8px" }}>{biasData.overall.accuracy}%</td>
                          <td style={{ padding: "8px" }}>{biasData.overall.sensitivity}%</td>
                          <td style={{ padding: "8px" }}>{biasData.overall.specificity}%</td>
                          <td style={{ padding: "8px" }}>—</td>
                        </tr>
                        {biasData.subgroups.map((sg) => {
                          const isBiased = sg.status === "BIASED";
                          const isReview = sg.status === "REVIEW";
                          const rowBg = isBiased
                            ? "#fef2f2"
                            : isReview
                            ? "#fffbeb"
                            : "transparent";
                          const sensColor = isBiased
                            ? "#991b1b"
                            : isReview
                            ? "#92400e"
                            : "var(--good)";

                          return (
                            <tr
                              key={sg.group}
                              style={{
                                borderBottom: "1px solid var(--line)",
                                background: rowBg,
                              }}
                            >
                              <td
                                style={{
                                  padding: "8px",
                                  fontWeight: isBiased ? 600 : 400,
                                  color: isBiased ? "#991b1b" : "inherit",
                                }}
                              >
                                {sg.group}
                              </td>
                              <td style={{ padding: "8px" }}>{sg.count}</td>
                              <td style={{ padding: "8px" }}>{sg.accuracy}%</td>
                              <td
                                style={{
                                  padding: "8px",
                                  color: sensColor,
                                  fontWeight: 600,
                                }}
                              >
                                {sg.sensitivity}%
                              </td>
                              <td style={{ padding: "8px" }}>{sg.specificity}%</td>
                              <td style={{ padding: "8px" }}>
                                {isBiased && (
                                  <span
                                    style={{
                                      background: "#fef2f2",
                                      color: "#991b1b",
                                      border: "1px solid #fca5a5",
                                      padding: "2px 8px",
                                      borderRadius: "12px",
                                      fontSize: "10px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    ⚠️ BIASED
                                  </span>
                                )}
                                {isReview && (
                                  <span
                                    style={{
                                      background: "#fffbeb",
                                      color: "#92400e",
                                      border: "1px solid #fde68a",
                                      padding: "2px 8px",
                                      borderRadius: "12px",
                                      fontSize: "10px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    🔍 REVIEW
                                  </span>
                                )}
                                {sg.status === "OK" && (
                                  <span
                                    style={{
                                      background: "#ecfdf5",
                                      color: "#166534",
                                      padding: "2px 8px",
                                      borderRadius: "12px",
                                      fontSize: "10px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    ✅ OK
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* No bias — success banner */}
                    {!biasData.bias_detected && (
                      <div
                        className="banner good"
                        style={{
                          background: "#ecfdf5",
                          borderColor: "#86d4a7",
                          marginBottom: "15px",
                        }}
                      >
                        <div className="banner-icon">✅</div>
                        <div style={{ color: "#166534" }}>
                          <b>No significant bias detected</b> across the "{biasData.subgroup_column}" subgroups. All groups have sensitivity within 10 percentage points of the overall average.
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* PROMPT BEFORE SELECTION */}
                {!selectedSubgroupCol && !biasData && !biasLoading && (
                  <div
                    className="banner info"
                    style={{
                      background: "#eff6ff",
                      borderColor: "#bfdbfe",
                      marginBottom: "15px",
                    }}
                  >
                    <div className="banner-icon">ℹ️</div>
                    <div style={{ color: "#1e40af" }}>
                      <b>Select a demographic column above</b> to run a subgroup
                      fairness audit. The system will compute accuracy,
                      sensitivity, and specificity for each group and flag any
                      bias automatically.
                    </div>
                  </div>
                )}

                {/* LOW SENSITIVITY WARNING */}
                {sens !== "—" && sens < 60 && (
                  <div className="banner bad" style={{ background: "#fef2f2", borderColor: "#fca5a5", color: "#991b1b", marginBottom: "15px" }}>
                    <div className="banner-icon">🚨</div>
                    <div>
                      <b>Low Sensitivity Warning:</b> The model only catches {sens}% of positive cases.
                      In a clinical setting this means many at-risk patients would be missed.
                      <b> This model may need improvement before deployment.</b>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="banner info">
                <div className="banner-icon">ℹ️</div>
                <div>
                  No model has been trained yet. Go back to Step 4 to train a model
                  and see performance metrics here.
                </div>
              </div>
            )}
          </div>

          {/* ── TRAINING DATA REPRESENTATIVENESS CHART ── */}
          <div className="card">
            <div className="card-title">
              Training Data Representativeness — Population Comparison
            </div>
            <p style={{ fontSize: "12px", color: "var(--mid)", marginBottom: "12px", lineHeight: 1.5 }}>
              Compare your model's training data demographics against the full patient population.
              Large gaps (&gt;15 percentage points) suggest the model may not generalise well to underrepresented groups.
            </p>

            {trainResults ? (
              <>
                <div style={{ marginBottom: "15px" }}>
                  <label className="lbl" style={{ marginBottom: "6px", display: "block" }}>
                    Select a demographic column to compare:
                  </label>
                  <select
                    className="sel"
                    value={selectedDistCol}
                    onChange={handleDistColChange}
                    style={{ width: "100%" }}
                  >
                    <option value="" disabled>
                      — Select a column —
                    </option>
                    {candidateColumns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>

                {distLoading && (
                  <div style={{ textAlign: "center", padding: "20px", color: "var(--mid)" }}>
                    ⏳ Computing distribution comparison...
                  </div>
                )}

                {distError && (
                  <div className="banner bad" style={{ marginBottom: "15px" }}>
                    <div className="banner-icon">❌</div>
                    <div>{distError}</div>
                  </div>
                )}

                {distData && !distLoading && (
                  <>
                    {/* AMBER WARNING */}
                    {distData.has_warnings && (
                      <div
                        className="banner warn"
                        style={{
                          background: "#fffbeb",
                          borderColor: "#fde68a",
                          color: "#92400e",
                          marginBottom: "15px",
                        }}
                      >
                        <div className="banner-icon">⚠️</div>
                        <div>
                          <b>Representativeness Warning:</b> The following groups have a &gt;15 percentage point gap between training data and the real population:
                          <ul style={{ margin: "6px 0 0 16px", fontSize: "12px" }}>
                            {distData.warning_messages.map((msg, i) => (
                              <li key={i}>{msg}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* BAR CHART */}
                    <div style={{ display: "grid", gap: "14px" }}>
                      {distData.comparison.map((item) => {
                        const maxPct = Math.max(item.real_population_pct, item.training_data_pct, 1);
                        const barScale = 100 / Math.max(maxPct, 50); // scale so bars are visible

                        return (
                          <div key={item.group}>
                            <div style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "4px",
                            }}>
                              <span style={{
                                fontSize: "12px",
                                fontWeight: 600,
                                color: item.warning ? "#92400e" : "var(--navy)",
                              }}>
                                {item.group}
                                {item.warning && (
                                  <span style={{
                                    marginLeft: "8px",
                                    background: "#fffbeb",
                                    color: "#92400e",
                                    border: "1px solid #fde68a",
                                    padding: "1px 6px",
                                    borderRadius: "8px",
                                    fontSize: "9px",
                                    fontWeight: 600,
                                  }}>
                                    {item.gap_pp} pp gap
                                  </span>
                                )}
                              </span>
                            </div>
                            {/* Training Data Bar */}
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                              <div style={{ width: "80px", fontSize: "10px", color: "var(--mid)", textAlign: "right" }}>Training</div>
                              <div style={{ flex: 1, height: "8px", borderRadius: "999px", background: "var(--line)" }}>
                                <div style={{
                                  width: `${item.training_data_pct * barScale}%`,
                                  height: "100%",
                                  borderRadius: "999px",
                                  background: item.warning ? "#f59e0b" : "var(--navy)",
                                  transition: "width 0.4s ease",
                                }}></div>
                              </div>
                              <div style={{ width: "45px", fontSize: "11px", fontWeight: 600 }}>{item.training_data_pct}%</div>
                            </div>
                            {/* Real Population Bar */}
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ width: "80px", fontSize: "10px", color: "var(--mid)", textAlign: "right" }}>Population</div>
                              <div style={{ flex: 1, height: "8px", borderRadius: "999px", background: "var(--line)" }}>
                                <div style={{
                                  width: `${item.real_population_pct * barScale}%`,
                                  height: "100%",
                                  borderRadius: "999px",
                                  background: "var(--teal)",
                                  transition: "width 0.4s ease",
                                }}></div>
                              </div>
                              <div style={{ width: "45px", fontSize: "11px", fontWeight: 600 }}>{item.real_population_pct}%</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div style={{ display: "flex", gap: "20px", marginTop: "14px", fontSize: "10px", color: "var(--mid)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <div style={{ width: "12px", height: "8px", borderRadius: "4px", background: "var(--navy)" }}></div>
                        Training Data ({distData.total_training} patients)
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <div style={{ width: "12px", height: "8px", borderRadius: "4px", background: "var(--teal)" }}></div>
                        Full Population ({distData.total_real} patients)
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <div style={{ width: "12px", height: "8px", borderRadius: "4px", background: "#f59e0b" }}></div>
                        &gt;15pp Gap (Amber Warning)
                      </div>
                    </div>

                    {/* No warnings — success */}
                    {!distData.has_warnings && (
                      <div
                        className="banner good"
                        style={{
                          background: "#ecfdf5",
                          borderColor: "#86d4a7",
                          marginTop: "12px",
                        }}
                      >
                        <div className="banner-icon">✅</div>
                        <div style={{ color: "#166534" }}>
                          <b>Training data is representative.</b> No demographic group has a gap exceeding 15 percentage points compared to the full population.
                        </div>
                      </div>
                    )}
                  </>
                )}

                {!selectedDistCol && !distData && !distLoading && (
                  <div className="banner info" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
                    <div className="banner-icon">ℹ️</div>
                    <div style={{ color: "#1e40af" }}>
                      <b>Select a demographic column above</b> to compare training data distribution
                      against the full patient population. This helps identify potential representativeness issues.
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="banner info">
                <div className="banner-icon">ℹ️</div>
                <div>
                  Train a model in Step 4 first to enable population comparison analysis.
                </div>
              </div>
            )}
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
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#991b1b", marginBottom: "5px" }}>
                  ⚠ Case 1: Sepsis Algorithm Bias
                </div>
                <div style={{ fontSize: "12px", color: "#7f1d1d", lineHeight: 1.5 }}>
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
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#92400e", marginBottom: "5px" }}>
                  ⚠ Case 2: Accuracy ≠ Safety
                </div>
                <div style={{ fontSize: "12px", color: "#78350f", lineHeight: 1.5 }}>
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
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#1e40af", marginBottom: "5px" }}>
                  ✅ How to Prevent This
                </div>
                <div style={{ fontSize: "12px", color: "#1e3a8a", lineHeight: 1.5 }}>
                  Always check subgroup performance. Always require human
                  review. Always retrain periodically. Never deploy based on
                  overall accuracy alone.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <div className="card">
            <div className="card-title">
              EU AI Act Compliance Checklist ({completed}/{total})
            </div>
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
                  d: "Performance gaps between demographic groups must be addressed before deployment",
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
                    transition: "all 0.15s ease",
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
                      flexShrink: 0,
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
        </div>
      </div>

      {/* COMPLETION BANNER */}
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

      <div className="screen-footer">
        <button className="btn outline" onClick={onPrev}>
          ← Previous
        </button>
        <button
          className="btn teal"
          onClick={downloadCertificate}
          disabled={pdfLoading}
        >
          {pdfLoading ? "⏳ Generating..." : "📄 Download Summary Certificate"}
        </button>
      </div>
    </section>
  );
}
