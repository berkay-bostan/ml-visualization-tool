import React, { useState } from "react";
import ColumnMapper from "./ColumnMapper";

export default function Step2({
  onNext,
  onPrev,
  file,
  setFile,
  datasetInfo,
  setDatasetInfo,
  targetColumn,
  setTargetColumn,
}) {
  const [isMapperOpen, setIsMapperOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/dataset/load", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.status === "success") setDatasetInfo(data);
      else setError(data.message);
    } catch (err) {
      setError("Sunucuya bağlanılamadı. FastAPI çalışıyor mu?");
    } finally {
      setLoading(false);
    }
  };

  // Gerçek missing data yüzdesini hesapla
  const getMissingPercent = () => {
    if (!datasetInfo?.columns_info?.missing_data_count) return "0.0";
    const missing = datasetInfo.columns_info.missing_data_count;
    const totalCells =
      datasetInfo.dataset_summary.total_patients *
      datasetInfo.dataset_summary.total_measurements;
    const totalMissing = Object.values(missing).reduce((a, b) => a + b, 0);
    return totalCells > 0 ? ((totalMissing / totalCells) * 100).toFixed(1) : "0.0";
  };

  // Her sütunun missing yüzdesini döndür
  const getColumnMissing = (col) => {
    if (!datasetInfo?.columns_info?.missing_data_count) return "0%";
    const count = datasetInfo.columns_info.missing_data_count[col] || 0;
    const total = datasetInfo.dataset_summary.total_patients;
    return total > 0 ? `${((count / total) * 100).toFixed(1)}%` : "0%";
  };

  // Sütunun eksik verisi var mı?
  const hasColumnMissing = (col) => {
    if (!datasetInfo?.columns_info?.missing_data_count) return false;
    return (datasetInfo.columns_info.missing_data_count[col] || 0) > 0;
  };

  // Veri tipini göster
  const getColumnType = (col) => {
    if (col === targetColumn) return "Target Label";
    if (!datasetInfo?.columns_info?.data_types) return "Feature";
    const dtype = datasetInfo.columns_info.data_types[col] || "";
    if (dtype.includes("int") || dtype.includes("float")) return "Numeric";
    if (dtype.includes("object")) return "Categorical";
    return "Feature";
  };

  return (
    <section className="screen active">
      <div className="screen-header">
        <div>
          <span className="step-tag">STEP 2 OF 7</span>
          <h2>Data Exploration — Understanding Your Patient Dataset</h2>
          <p>
            Before training any model, we examine what data is available. Use
            the default dataset or upload your own CSV file of de-identified
            patient records.
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
            <div className="card-title">Data Source</div>

            <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
              <button
                className="btn outline"
                style={{
                  flex: 1,
                  padding: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                Use Default Dataset
              </button>
              <button
                className="btn outline"
                style={{
                  flex: 1,
                  padding: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  borderColor: "var(--navy)",
                  color: "var(--navy)",
                }}
              >
                Upload Your CSV
              </button>
            </div>

            {file ? (
              <div
                style={{
                  padding: "12px",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  border: "1px solid var(--line)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--navy)",
                    fontWeight: 600,
                  }}
                >
                  📄 {file.name}
                </span>
                <button
                  className="btn outline"
                  style={{ padding: "4px 8px", fontSize: "11px" }}
                  onClick={() => {
                    setFile(null);
                    setDatasetInfo(null);
                    setTargetColumn("");
                  }}
                >
                  Change
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ marginBottom: "10px", width: "100%" }}
              />
            )}

            <button
              className="btn teal"
              style={{
                width: "100%",
                marginBottom: "15px",
                background: "var(--navy)",
                color: "white",
                border: "none",
              }}
              onClick={handleFileUpload}
              disabled={loading || !file}
            >
              {loading ? "Analysing..." : "Upload & Analyse Data"}
            </button>

            {error && (
              <div className="banner bad" style={{ marginBottom: "15px" }}>
                ❌ {error}
              </div>
            )}

            <label className="lbl">
              Target Column (What We Want to Predict)
            </label>
            <select
              className="sel"
              value={targetColumn}
              onChange={(e) => setTargetColumn(e.target.value)}
            >
              <option value="">-- Select Target Column --</option>
              {datasetInfo?.columns?.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <div
              style={{
                fontSize: "11px",
                color: "var(--muted)",
                marginTop: "5px",
              }}
            >
              This is the outcome the model will learn to predict.
            </div>

            <button
              className="btn primary"
              style={{
                marginTop: "12px",
                width: "100%",
                background: "var(--navy)",
              }}
              onClick={() => setIsMapperOpen(true)}
              disabled={!datasetInfo}
            >
              🗂 Open Column Mapper & Validate
            </button>

            {!targetColumn && datasetInfo && (
              <div
                className="banner bad"
                style={{
                  marginTop: "15px",
                  background: "#fef2f2",
                  borderColor: "#fca5a5",
                  color: "#991b1b",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <div style={{ fontSize: "16px" }}>🚫</div>
                <div style={{ fontSize: "13px", lineHeight: 1.5 }}>
                  <b>Action required:</b> You must open the Column Mapper,
                  validate the schema, and save before continuing to Step 3.
                </div>
              </div>
            )}

            {targetColumn && (
              <div
                className="banner good"
                style={{
                  marginTop: "15px",
                  background: "#ecfdf5",
                  borderColor: "#86d4a7",
                }}
              >
                <div className="banner-icon">✅</div>
                <div style={{ color: "#166534" }}>
                  <b>Target column set:</b> <code>{targetColumn}</code> — You
                  may now proceed to Step 3.
                </div>
              </div>
            )}
          </div>

          {datasetInfo && (
            <div className="card">
              <div className="card-title">Dataset Summary</div>

              <div className="kpis" style={{ display: "flex", gap: "10px" }}>
                <div
                  className="kpi"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    border: "1px solid var(--line)",
                    padding: "15px 5px",
                    borderRadius: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: "var(--navy)",
                    }}
                  >
                    {datasetInfo.dataset_summary.total_patients}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--muted)",
                      textTransform: "uppercase",
                      marginTop: "5px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Patients
                  </div>
                </div>
                <div
                  className="kpi"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    border: "1px solid var(--line)",
                    padding: "15px 5px",
                    borderRadius: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: "var(--navy)",
                    }}
                  >
                    {datasetInfo.dataset_summary.total_measurements}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--muted)",
                      textTransform: "uppercase",
                      marginTop: "5px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Measurements
                  </div>
                </div>
                <div
                  className="kpi"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    border: `1px solid ${parseFloat(getMissingPercent()) > 0 ? "#fde68a" : "rgba(13,122,80,.2)"}`,
                    background: parseFloat(getMissingPercent()) > 0 ? "#fffbeb" : "var(--good-bg)",
                    padding: "15px 5px",
                    borderRadius: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: parseFloat(getMissingPercent()) > 0 ? "#b45309" : "var(--good)",
                    }}
                  >
                    {getMissingPercent()}%
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: parseFloat(getMissingPercent()) > 0 ? "#b45309" : "var(--good)",
                      textTransform: "uppercase",
                      marginTop: "5px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Missing Data
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SAĞ KOLON */}
        <div>
          {datasetInfo ? (
            <div className="card">
              <div className="card-title">
                Patient Measurements (Features)
              </div>

              <div
                className="tbl-wrap"
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                  }}
                >
                  <thead style={{ background: "#f8fafc" }}>
                    <tr
                      style={{
                        borderBottom: "2px solid var(--line)",
                        color: "var(--muted)",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      <th style={{ padding: "12px 15px" }}>Measurement</th>
                      <th style={{ padding: "12px 15px" }}>Type</th>
                      <th style={{ padding: "12px 15px" }}>Missing?</th>
                      <th style={{ padding: "12px 15px" }}>Action Needed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datasetInfo.columns.map((col, i) => (
                      <tr
                        key={i}
                        style={{
                          borderBottom: "1px solid var(--line)",
                          fontSize: "13px",
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 15px",
                            fontWeight: 500,
                            color: "var(--navy)",
                          }}
                        >
                          {col}
                        </td>
                        <td
                          style={{ padding: "12px 15px", color: "var(--mid)" }}
                        >
                          {getColumnType(col)}
                        </td>
                        <td
                          style={{
                            padding: "12px 15px",
                            color: hasColumnMissing(col) ? "var(--warn)" : "var(--mid)",
                            fontWeight: hasColumnMissing(col) ? 600 : 400,
                          }}
                        >
                          {getColumnMissing(col)}
                        </td>
                        <td style={{ padding: "12px 15px" }}>
                          {hasColumnMissing(col) ? (
                            <span
                              className="tag warn"
                              style={{
                                background: "#fffbeb",
                                color: "#92400e",
                                padding: "4px 10px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: 600,
                                border: "1px solid #fde68a",
                              }}
                            >
                              Needs Imputation
                            </span>
                          ) : (
                            <span
                              className="tag good"
                              style={{
                                background: "#ecfdf5",
                                color: "#059669",
                                padding: "4px 10px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: 600,
                                border: "1px solid #a7f3d0",
                              }}
                            >
                              Ready
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-title">Data Schema Preview</div>
              <div className="banner info">
                <div className="banner-icon">ℹ️</div>
                <div>
                  Upload a CSV file on the left to see column details and the
                  data schema table here.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="screen-footer">
        <div
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--muted)",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          STEP 2 / 7 · DATA EXPLORATION
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn outline" onClick={onPrev}>
            ← Previous
          </button>
          <button className="btn primary" onClick={onNext}>
            Next Step →
          </button>
        </div>
      </div>

      <ColumnMapper
        isOpen={isMapperOpen}
        columns={datasetInfo?.columns}
        currentTarget={targetColumn}
        onClose={() => setIsMapperOpen(false)}
        onSave={(col) => {
          setTargetColumn(col);
          setIsMapperOpen(false);
        }}
      />
    </section>
  );
}
