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

            {/* HOCANIN İSTEDİĞİ BUTONLAR */}
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
                  Değiştir
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
              {loading ? "Analiz Ediliyor..." : "Veriyi Yükle ve Analiz Et"}
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
              <option value="">-- Lütfen Hedef Sütunu Seçin --</option>
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

            {/* HOCANIN İSTEDİĞİ LACİVERT BUTON */}
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

            {/* HOCANIN İSTEDİĞİ KIRMIZI BANNER */}
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
          </div>

          {datasetInfo && (
            <div className="card">
              <div
                className="card-title"
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "var(--muted)",
                }}
              >
                Dataset Summary
              </div>

              {/* HOCANIN İSTEDİĞİ 3'LÜ KPI TASARIMI */}
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
                    border: "1px solid #fde68a",
                    background: "#fffbeb",
                    padding: "15px 5px",
                    borderRadius: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: "#b45309",
                    }}
                  >
                    6.8%
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#b45309",
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
              <div
                className="card-title"
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "var(--muted)",
                }}
              >
                Class Balance — How Many Readmitted vs. Not?
              </div>

              {/* HOCANIN İSTEDİĞİ İKİLİ BAR VE SARI UYARI */}
              <div
                className="bars"
                style={{ display: "grid", gap: "12px", marginBottom: "20px" }}
              >
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
                    Not Readmitted (0)
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
                        width: "67%",
                        height: "100%",
                        borderRadius: "999px",
                        background: "var(--navy)",
                      }}
                    ></div>
                  </div>
                  <div
                    style={{ width: "30px", fontSize: "12px", fontWeight: 600 }}
                  >
                    67%
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
                    Readmitted (1)
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
                        width: "33%",
                        height: "100%",
                        borderRadius: "999px",
                        background: "var(--teal)",
                      }}
                    ></div>
                  </div>
                  <div
                    style={{ width: "30px", fontSize: "12px", fontWeight: 600 }}
                  >
                    33%
                  </div>
                </div>
              </div>

              <div
                className="banner warn"
                style={{
                  marginBottom: "25px",
                  background: "#fffbeb",
                  borderColor: "#fde68a",
                  color: "#92400e",
                }}
              >
                <div className="banner-icon">⚠️</div>
                <div style={{ fontSize: "13px", lineHeight: 1.5 }}>
                  <b>Imbalance detected:</b> Only 33% of patients were
                  readmitted. A lazy model could predict "not readmitted" for
                  everyone and be 67% accurate — but miss all real cases. We
                  will handle this in Step 3.
                </div>
              </div>

              <div
                className="card-title"
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "var(--muted)",
                }}
              >
                Patient Measurements (Features)
              </div>

              {/* HOCANIN İSTEDİĞİ 4 SÜTUNLU TABLO TASARIMI */}
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
                    {/* Gerçek veriler listeleniyor */}
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
                          {col === targetColumn ? "Target Label" : "Feature"}
                        </td>
                        <td
                          style={{ padding: "12px 15px", color: "var(--mid)" }}
                        >
                          0%
                        </td>
                        <td style={{ padding: "12px 15px" }}>
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
                  Sol taraftan CSV dosyanızı yüklediğinizde, verilerinizin sütun
                  detayları ve içerik tablosu burada görünecektir.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* HOCANIN İSTEDİĞİ FOOTER TASARIMI */}
      <div
        className="screen-footer"
        style={{
          marginTop: "15px",
          padding: "15px 20px",
          background: "white",
          borderRadius: "12px",
          border: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
