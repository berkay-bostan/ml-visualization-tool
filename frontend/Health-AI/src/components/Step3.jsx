import React, { useState } from "react";

export default function Step3({
  onNext,
  onPrev,
  file,
  targetColumn,
  prepResult,
  setPrepResult,
}) {
  const [trainSplit, setTrainSplit] = useState(80);
  const [missingStrategy, setMissingStrategy] = useState("median");
  const [normalization, setNormalization] = useState("z-score");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePreprocess = async () => {
    if (!file || !targetColumn) {
      setError(
        "File or target column is missing. Please go back to Step 2 and check.",
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
      const response = await fetch("http://localhost:8000/preprocess", {
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
      setError("Processing failed. Is the backend running?");
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
            Before a model can learn, the data must be split into training and
            testing, missing values filled, and scaled correctly.
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
        {/* SOL KOLON: AYARLAR */}
        <div>
          <div className="card">
            <div className="card-title">Preparation Settings</div>

            <label className="lbl">Train / Test Split</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginTop: "4px",
              }}
            >
              <input
                type="range"
                min="60"
                max="90"
                step="5"
                value={trainSplit}
                onChange={(e) => setTrainSplit(e.target.value)}
                style={{ flex: 1 }}
              />
              <div
                style={{
                  padding: "4px 8px",
                  background: "var(--sky)",
                  color: "var(--navy)",
                  fontWeight: 600,
                  borderRadius: "8px",
                  border: "1px solid var(--line2)",
                  minWidth: "55px",
                  textAlign: "center",
                }}
              >
                {trainSplit}% / {100 - trainSplit}%
              </div>
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--muted)",
                marginTop: "5px",
              }}
            >
              The model learns from the training group and is tested on the
              rest.
            </div>

            <label className="lbl" style={{ marginTop: "15px" }}>
              Handling Missing Values
            </label>
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

            <label className="lbl" style={{ marginTop: "15px" }}>
              Normalisation
            </label>
            <select
              className="sel"
              value={normalization}
              onChange={(e) => setNormalization(e.target.value)}
            >
              <option value="z-score">
                Z-score (recommended for most models)
              </option>
              <option value="min-max">Min-Max (0 to 1 scale)</option>
              <option value="none">None — skip normalisation</option>
            </select>

            {error && (
              <div className="banner bad" style={{ marginTop: "10px" }}>
                <div className="banner-icon">❌</div>
                <div>{error}</div>
              </div>
            )}

            <button
              className="btn teal"
              style={{ width: "100%", marginTop: "20px" }}
              onClick={handlePreprocess}
              disabled={loading}
            >
              {loading
                ? "⏳ Processing Data..."
                : "✓ Apply Preparation Settings"}
            </button>
          </div>
        </div>

        {/* SAĞ KOLON: GERÇEK SONUÇLAR */}
        <div>
          <div className="card">
            <div className="card-title">Before & After Normalisation</div>
            {prepResult ? (
              <div className="grid2">
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--muted)",
                      textAlign: "center",
                      marginBottom: "8px",
                    }}
                  >
                    BEFORE (raw values)
                  </div>
                  <div
                    className="bars"
                    style={{ display: "grid", gap: "10px" }}
                  >
                    {[
                      {
                        label: "Min",
                        value: prepResult.before.min,
                        width: "14%",
                        color: "var(--bad)",
                      },
                      {
                        label: "Mean",
                        value: prepResult.before.mean,
                        width: "38%",
                        color: "var(--navy)",
                      },
                      {
                        label: "Max",
                        value: prepResult.before.max,
                        width: "80%",
                        color: "var(--teal)",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "60px",
                            fontSize: "12px",
                            color: "var(--mid)",
                            textAlign: "right",
                          }}
                        >
                          {item.label}
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
                              width: item.width,
                              height: "100%",
                              borderRadius: "999px",
                              background: item.color,
                              transition: "width 0.4s ease",
                            }}
                          ></div>
                        </div>
                        <div
                          style={{
                            width: "50px",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--muted)",
                      textAlign: "center",
                      marginBottom: "8px",
                    }}
                  >
                    AFTER ({normalization})
                  </div>
                  <div
                    className="bars"
                    style={{ display: "grid", gap: "10px" }}
                  >
                    {[
                      {
                        label: "Min",
                        value: prepResult.after.min,
                        width: "10%",
                        color: "var(--bad)",
                      },
                      {
                        label: "Mean",
                        value: prepResult.after.mean,
                        width: "50%",
                        color: "var(--navy)",
                      },
                      {
                        label: "Max",
                        value: prepResult.after.max,
                        width: "90%",
                        color: "var(--teal)",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "60px",
                            fontSize: "12px",
                            color: "var(--mid)",
                            textAlign: "right",
                          }}
                        >
                          {item.label}
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
                              width: item.width,
                              height: "100%",
                              borderRadius: "999px",
                              background: item.color,
                              transition: "width 0.4s ease",
                            }}
                          ></div>
                        </div>
                        <div
                          style={{
                            width: "50px",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  color: "var(--muted)",
                }}
              >
                Apply the settings on the left to see your data analysis
                results.
              </div>
            )}

            {prepResult && (
              <div className="banner good" style={{ marginTop: "20px" }}>
                <div className="banner-icon">✅</div>
                <div>
                  <b>Ready:</b> Data is clean and split into{" "}
                  {prepResult.train_patients} Train and{" "}
                  {prepResult.test_patients} Test patients. Proceed to Step 4.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="screen-footer">
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
