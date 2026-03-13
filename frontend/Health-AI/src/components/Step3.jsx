import React, { useState } from "react";

export default function Step3({ onNext, onPrev, file, targetColumn }) {
  const [trainSplit, setTrainSplit] = useState(80);
  const [missingStrategy, setMissingStrategy] = useState("median");
  const [normalization, setNormalization] = useState("z-score");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prepResult, setPrepResult] = useState(null);

  const handlePreprocess = async () => {
    if (!file || !targetColumn) {
      setError(
        "Dosya veya hedef sütun eksik. Lütfen Step 2'ye dönüp kontrol edin.",
      );
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_column", targetColumn);
    formData.append("test_size", (100 - trainSplit) / 100);
    formData.append("missing_strategy", missingStrategy);
    formData.append("normalization", normalization);

    try {
      const response = await fetch("http://127.0.0.1:8000/preprocess", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.status === "success") {
        setPrepResult(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("İşlem başarısız oldu. Backend açık mı?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="screen active">
      <div className="screen-header">
        <div>
          <span className="step-tag">STEP 3 OF 7</span>
          <h2>Data Preparation — Cleaning & Organising Your Data</h2>
          <p>
            Before a model can learn, the data must be clean, consistent, and
            split into two groups: training and testing.
          </p>
        </div>
        <div className="hdr-right">
          <button
            className="btn primary"
            onClick={onNext}
            disabled={!prepResult}
          >
            Next Step →
          </button>
        </div>
      </div>

      <div className="cols">
        {/* SOL TARAF: AYARLAR */}
        <div>
          <div className="card">
            <div className="card-title">Preparation Settings</div>

            <label className="lbl">
              Train / Test Split ({trainSplit}% Train)
            </label>
            <div className="slider-row">
              <input
                type="range"
                min="60"
                max="90"
                step="5"
                value={trainSplit}
                onChange={(e) => setTrainSplit(e.target.value)}
              />
              <div className="slider-val">{trainSplit}%</div>
            </div>
            <div className="slider-hint">
              The model learns from the training group and is tested on the
              rest.
            </div>

            <label className="lbl">Handling Missing Values</label>
            <select
              className="sel"
              value={missingStrategy}
              onChange={(e) => setMissingStrategy(e.target.value)}
            >
              <option value="median">
                Fill with the middle value (median) — recommended
              </option>
              <option value="most_frequent">
                Fill with the most common value (mode)
              </option>
            </select>

            <label className="lbl">Normalisation</label>
            <select
              className="sel"
              value={normalization}
              onChange={(e) => setNormalization(e.target.value)}
            >
              <option value="z-score">
                Z-score (recommended for most models)
              </option>
              <option value="min-max">Min-Max (0 to 1 scale)</option>
            </select>

            {error && (
              <div className="banner bad" style={{ marginTop: "10px" }}>
                ❌ {error}
              </div>
            )}

            <button
              className="btn teal"
              style={{ width: "100%", marginTop: "20px" }}
              onClick={handlePreprocess}
              disabled={loading}
            >
              {loading ? "İşleniyor..." : "✓ Apply Preparation Settings"}
            </button>
          </div>
        </div>

        {/* SAĞ TARAF: SONUÇLAR */}
        <div>
          {prepResult ? (
            <div className="card">
              <div className="card-title">
                Results: Normalisation (Before & After)
              </div>
              <div className="grid2">
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--muted)",
                      marginBottom: "8px",
                    }}
                  >
                    BEFORE (Raw Values)
                  </div>
                  <p style={{ fontSize: "13px" }}>
                    <b>Min:</b> {prepResult.before.min}
                  </p>
                  <p style={{ fontSize: "13px" }}>
                    <b>Mean:</b> {prepResult.before.mean}
                  </p>
                  <p style={{ fontSize: "13px" }}>
                    <b>Max:</b> {prepResult.before.max}
                  </p>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--muted)",
                      marginBottom: "8px",
                    }}
                  >
                    AFTER ({normalization})
                  </div>
                  <p style={{ fontSize: "13px" }}>
                    <b>Min:</b> {prepResult.after.min}
                  </p>
                  <p style={{ fontSize: "13px" }}>
                    <b>Mean:</b> {prepResult.after.mean}
                  </p>
                  <p style={{ fontSize: "13px" }}>
                    <b>Max:</b> {prepResult.after.max}
                  </p>
                </div>
              </div>
              <div className="banner good" style={{ marginTop: "15px" }}>
                <div className="banner-icon">✅</div>
                <div>
                  <b>Ready:</b> Data is clean and split into{" "}
                  {prepResult.train_patients} Train / {prepResult.test_patients}{" "}
                  Test patients. Proceed to Step 4.
                </div>
              </div>
            </div>
          ) : (
            <div
              className="card"
              style={{
                textAlign: "center",
                padding: "40px",
                color: "var(--muted)",
              }}
            >
              Sol taraftan ayarları seçip <b>Apply Preparation Settings</b>{" "}
              butonuna basın.
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
        <button className="btn primary" onClick={onNext} disabled={!prepResult}>
          Next Step →
        </button>
      </div>
    </section>
  );
}
