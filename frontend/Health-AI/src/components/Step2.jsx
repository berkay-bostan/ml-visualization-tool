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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMapperOpen, setIsMapperOpen] = useState(false);

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

      if (data.status === "success") {
        setDatasetInfo(data);
      } else {
        setError(data.message);
      }
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
          <p>Upload your own CSV file of de-identified patient records.</p>
        </div>
        <div className="hdr-right">
          <button
            className="btn primary"
            onClick={onNext}
            disabled={!targetColumn}
          >
            Next Step →
          </button>
        </div>
      </div>

      <div className="cols">
        <div>
          <div className="card">
            <div className="card-title">Data Source</div>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <button
              className="btn teal"
              style={{ width: "100%" }}
              onClick={handleFileUpload}
              disabled={loading}
            >
              {loading ? "Analiz Ediliyor..." : "Veriyi Yükle ve Analiz Et"}
            </button>

            {error && (
              <div className="banner bad" style={{ marginTop: "10px" }}>
                <div className="banner-icon">❌</div>
                <div>{error}</div>
              </div>
            )}

            <div className="banner warn" style={{ marginTop: "15px" }}>
              <div className="banner-icon">⚠️</div>
              <div>
                <b>Action needed:</b> Open the Column Mapper to confirm your
                data structure before continuing to Step 3.
              </div>
            </div>

            <button
              className="btn"
              style={{ width: "100%", marginTop: "10px" }}
              onClick={() => setIsMapperOpen(true)}
              disabled={!datasetInfo}
            >
              🗂{" "}
              {targetColumn
                ? `Target: ${targetColumn}`
                : "Open Column Mapper & Validate"}
            </button>
          </div>
        </div>

        <div>
          {datasetInfo && (
            <div className="card">
              <div className="card-title">Dataset Summary</div>
              <div className="kpis">
                <div className="kpi">
                  <div className="kpi-val">
                    {datasetInfo.dataset_summary.total_patients}
                  </div>
                  <div className="kpi-name">Patients</div>
                </div>
                <div className="kpi">
                  <div className="kpi-val">
                    {datasetInfo.dataset_summary.total_measurements}
                  </div>
                  <div className="kpi-name">Measurements</div>
                </div>
              </div>
              <div className="banner good" style={{ marginTop: "15px" }}>
                <div className="banner-icon">✅</div>
                <div>
                  Veri başarıyla backend tarafından analiz edildi. Lütfen hedef
                  sütunu seçin.
                </div>
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
        <button
          className="btn primary"
          onClick={onNext}
          disabled={!targetColumn}
        >
          Next Step →
        </button>
      </div>

      <ColumnMapper
        isOpen={isMapperOpen}
        columns={datasetInfo?.columns}
        onClose={() => setIsMapperOpen(false)}
        onSave={(col) => {
          setTargetColumn(col);
          setIsMapperOpen(false);
        }}
      />
    </section>
  );
}
