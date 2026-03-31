import React, { useState, useEffect, useRef } from "react";

export default function Step4({
  onNext,
  onPrev,
  file,
  targetColumn,
  setTrainResults,
}) {
  const [knnK, setKnnK] = useState(5);
  const [activeModel, setActiveModel] = useState("knn");
  const [isTraining, setIsTraining] = useState(false);
  const [autoRetrain, setAutoRetrain] = useState(true);

  // Eğitilen modellerin listesi (Karşılaştırma için)
  const [compareList, setCompareList] = useState([]);
  const [latestResult, setLatestResult] = useState(null);

  const canvasRef = useRef(null);

  const [trainError, setTrainError] = useState(null);

  // FastAPI model training function
  const handleTrain = async (silent = false) => {
    if (!file || !targetColumn) return;

    if (!silent) setIsTraining(true);
    setTrainError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_column", targetColumn);
    formData.append("algorithm", activeModel);
    formData.append("knn_k", knnK);
    formData.append("test_size", 0.2);

    try {
      const response = await fetch("http://localhost:8000/train", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.status === "success") {
        setTrainResults(data);
        setLatestResult({
          id: `${activeModel}-${activeModel === "knn" ? knnK : "default"}`,
          name: `${activeModel.toUpperCase()} ${activeModel === "knn" ? `(K=${knnK})` : ""}`,
          ...data.metrics,
        });
        setTrainError(null);
      } else {
        setTrainError(data.message);
      }
    } catch (err) {
      console.error("Training Error", err);
      setTrainError("Failed to connect to the backend. Is FastAPI running?");
    } finally {
      if (!silent) setIsTraining(false);
    }
  };

  // AUTO-RETRAIN (Debounce): 600ms after slider change
  useEffect(() => {
    if (!autoRetrain || !file || !targetColumn) return;
    const timer = setTimeout(() => {
      handleTrain(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [knnK, activeModel, autoRetrain]);

  // Modeli Tabloya Ekleme (+ Compare Butonu)
  const addToCompare = () => {
    if (!latestResult) return;
    // Aynı modelden (kopya) varsa ekleme
    if (!compareList.find((m) => m.id === latestResult.id)) {
      setCompareList([...compareList, latestResult]);
    }
  };

  // KNN Grafiğini Çizen Animasyon
  useEffect(() => {
    if (activeModel !== "knn") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const pts = [
      [0.2, 0.3, 0],
      [0.25, 0.55, 0],
      [0.15, 0.65, 1],
      [0.3, 0.75, 1],
      [0.4, 0.4, 0],
      [0.5, 0.25, 0],
      [0.45, 0.6, 1],
      [0.55, 0.7, 1],
      [0.65, 0.45, 0],
      [0.7, 0.6, 1],
      [0.75, 0.3, 0],
      [0.8, 0.65, 1],
      [0.35, 0.2, 0],
      [0.6, 0.8, 1],
      [0.85, 0.4, 0],
    ];
    const newPt = [0.48, 0.52];

    const dists = pts.map(([px, py, c], i) => ({
      i,
      dist: Math.hypot(px - newPt[0], py - newPt[1]),
      c,
    }));
    dists.sort((a, b) => a.dist - b.dist);
    const neighbors = new Set(dists.slice(0, knnK).map((d) => d.i));
    const kRadius = dists[knnK - 1]?.dist || 0.1;

    ctx.beginPath();
    ctx.arc(
      newPt[0] * w,
      newPt[1] * h,
      kRadius * Math.min(w, h),
      0,
      Math.PI * 2,
    );
    ctx.strokeStyle = "rgba(26,107,154,0.35)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(26,107,154,0.05)";
    ctx.fill();

    pts.forEach(([px, py, c], i) => {
      ctx.beginPath();
      ctx.arc(px * w, py * h, neighbors.has(i) ? 7 : 5, 0, Math.PI * 2);
      ctx.fillStyle =
        c === 1
          ? neighbors.has(i)
            ? "#B91C1C"
            : "rgba(185,28,28,0.4)"
          : neighbors.has(i)
            ? "#0D7A50"
            : "rgba(13,122,80,0.4)";
      ctx.fill();
      if (neighbors.has(i)) {
        ctx.strokeStyle = c === 1 ? "#B91C1C" : "#0D7A50";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(px * w, py * h);
        ctx.lineTo(newPt[0] * w, newPt[1] * h);
        ctx.strokeStyle = "rgba(26,107,154,0.25)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    const sx = newPt[0] * w,
      sy = newPt[1] * h,
      sr = 10;
    ctx.fillStyle = "#0D2340";
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI) / 5 - Math.PI / 2,
        b = (i * 4 * Math.PI) / 5 + (2 * Math.PI) / 5 - Math.PI / 2;
      if (i === 0) ctx.moveTo(sx + sr * Math.cos(a), sy + sr * Math.sin(a));
      else ctx.lineTo(sx + sr * Math.cos(a), sy + sr * Math.sin(a));
      ctx.lineTo(sx + sr * 0.4 * Math.cos(b), sy + sr * 0.4 * Math.sin(b));
    }
    ctx.closePath();
    ctx.fill();
  }, [knnK, activeModel]);

  return (
    <section className="screen active">
      <div className="screen-header">
        <div>
          <span className="step-tag">STEP 4 OF 7</span>
          <h2>Model Selection & Parameter Tuning</h2>
          <p>
            Choose a machine learning algorithm, adjust its settings, and train
            it on your patient data.
          </p>
        </div>
        <div className="hdr-right">
          <div
            style={{
              fontSize: "11px",
              color: "var(--muted)",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            Auto-retrain on change:
            <input
              type="checkbox"
              checked={autoRetrain}
              onChange={(e) => setAutoRetrain(e.target.checked)}
            />{" "}
            On
          </div>
          <button
            className="btn primary"
            onClick={() => {
              handleTrain();
              onNext();
            }}
            disabled={isTraining || !latestResult}
          >
            Next Step →
          </button>
        </div>
      </div>

      <div className="cols">
        {/* SOL KOLON */}
        <div>
          <div className="card">
            <div className="card-title">Choose Algorithm</div>
            <div
              className="model-tabs"
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "15px",
              }}
            >
              {["knn", "svm", "dt", "rf", "lr", "nb"].map((model) => (
                <div
                  key={model}
                  onClick={() => setActiveModel(model)}
                  style={{
                    cursor: "pointer",
                    padding: "8px 16px",
                    borderRadius: "10px",
                    fontSize: "12px",
                    background: activeModel === model ? "var(--navy)" : "white",
                    color: activeModel === model ? "#fff" : "var(--mid)",
                    border:
                      activeModel === model ? "none" : "1px solid var(--line2)",
                  }}
                >
                  {model.toUpperCase()}
                </div>
              ))}
            </div>

            {activeModel === "knn" && (
              <>
                <div className="card-title">Parameters</div>
                <label className="lbl">
                  K — Number of Similar Patients to Compare
                </label>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <input
                    type="range"
                    min="1"
                    max="25"
                    step="1"
                    value={knnK}
                    onChange={(e) => setKnnK(e.target.value)}
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
                    {knnK}
                  </div>
                </div>
              </>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                className="btn teal"
                style={{ flex: 1 }}
                onClick={() => handleTrain(false)}
                disabled={isTraining}
              >
                {isTraining ? "⏳ Training..." : "⚡ Train Model"}
              </button>
              <button
                className="btn outline"
                onClick={addToCompare}
                disabled={!latestResult}
              >
                + Compare
              </button>
            </div>

            {trainError && (
              <div
                className="banner bad"
                style={{
                  marginTop: "12px",
                  background: "#fef2f2",
                  borderColor: "#fca5a5",
                }}
              >
                <div className="banner-icon">❌</div>
                <div
                  style={{
                    color: "#991b1b",
                    fontSize: "13px",
                    lineHeight: 1.5,
                  }}
                >
                  <b>Training Failed:</b> {trainError}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SAĞ KOLON */}
        <div>
          {activeModel === "knn" && (
            <div className="card">
              <div className="card-title">KNN Visualisation</div>
              <canvas
                ref={canvasRef}
                style={{
                  width: "100%",
                  height: "220px",
                  background: "var(--paper)",
                  borderRadius: "12px",
                  border: "1px solid var(--line)",
                }}
              ></canvas>
            </div>
          )}

          {/* KARŞILAŞTIRMA TABLOSU */}
          {compareList.length > 0 && (
            <div className="card" style={{ marginTop: "15px" }}>
              <div className="card-title">Model Comparison</div>
              <div className="tbl-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Model & Settings</th>
                      <th>Accuracy</th>
                      <th>Sensitivity ★</th>
                      <th>Specificity</th>
                      <th>AUC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareList.map((res, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{res.name}</td>
                        <td>{res.accuracy}%</td>
                        <td
                          style={{
                            color:
                              res.sensitivity < 70
                                ? "var(--bad)"
                                : "var(--good)",
                            fontWeight: 600,
                          }}
                        >
                          {res.sensitivity}%
                        </td>
                        <td>{res.specificity}%</td>
                        <td>{res.auc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
      </div>
    </section>
  );
}
