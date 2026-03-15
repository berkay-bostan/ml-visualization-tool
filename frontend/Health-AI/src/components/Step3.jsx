import React, { useState } from "react";

export default function Step3({ onNext, onPrev, file, targetColumn }) {
  const [trainSplit, setTrainSplit] = useState(80);
  const [missingStrategy, setMissingStrategy] = useState("median");
  const [normalization, setNormalization] = useState("z-score");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prepResult, setPrepResult] = useState(null); // Backendden gelen veriler burada tutulacak

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
                }}
              >
                {trainSplit}%
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
              {loading
                ? "⏳ Veriler İşleniyor..."
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
                    <div
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
                        Min
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
                            width: "14%",
                            height: "100%",
                            borderRadius: "999px",
                            background: "var(--bad)",
                          }}
                        ></div>
                      </div>
                      <div
                        style={{
                          width: "30px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {prepResult.before.min}
                      </div>
                    </div>
                    <div
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
                        Mean
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
                            width: "38%",
                            height: "100%",
                            borderRadius: "999px",
                            background: "var(--navy)",
                          }}
                        ></div>
                      </div>
                      <div
                        style={{
                          width: "30px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {prepResult.before.mean}
                      </div>
                    </div>
                    <div
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
                        Max
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
                            width: "80%",
                            height: "100%",
                            borderRadius: "999px",
                            background: "var(--teal)",
                          }}
                        ></div>
                      </div>
                      <div
                        style={{
                          width: "30px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {prepResult.before.max}
                      </div>
                    </div>
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
                    <div
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
                        Min
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
                            width: "10%",
                            height: "100%",
                            borderRadius: "999px",
                            background: "var(--bad)",
                          }}
                        ></div>
                      </div>
                      <div
                        style={{
                          width: "40px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {prepResult.after.min}
                      </div>
                    </div>
                    <div
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
                        Mean
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
                            width: "50%",
                            height: "100%",
                            borderRadius: "999px",
                            background: "var(--navy)",
                          }}
                        ></div>
                      </div>
                      <div
                        style={{
                          width: "40px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {prepResult.after.mean}
                      </div>
                    </div>
                    <div
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
                        Max
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
                            width: "90%",
                            height: "100%",
                            borderRadius: "999px",
                            background: "var(--teal)",
                          }}
                        ></div>
                      </div>
                      <div
                        style={{
                          width: "40px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {prepResult.after.max}
                      </div>
                    </div>
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
                Lütfen soldaki ayarları uygulayarak verilerinizi analiz edin.
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
