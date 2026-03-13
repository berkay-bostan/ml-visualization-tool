import React, { useState, useEffect, useRef } from "react";

export default function Step4({ onNext, onPrev }) {
  const [activeModel, setActiveModel] = useState("knn");
  const [knnK, setKnnK] = useState(5);
  const canvasRef = useRef(null);

  // KNN Grafiğini Çizdiren Fonksiyon
  useEffect(() => {
    if (activeModel !== "knn" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    // Yüksek çözünürlük için ayar
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // Temsili hasta verileri (x, y kordinatları ve durumları)
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
    const newPt = [0.48, 0.52]; // Yeni Hasta (Yıldız)

    // Mesafeleri hesapla ve K kadar en yakın komşuyu bul
    const dists = pts.map(([px, py, c], i) => ({
      i,
      dist: Math.hypot(px - newPt[0], py - newPt[1]),
      c,
    }));
    dists.sort((a, b) => a.dist - b.dist);
    const neighbors = new Set(dists.slice(0, knnK).map((d) => d.i));
    const kRadius = dists[knnK - 1]?.dist || 0.1;

    // Etki Alanını (Daireyi) Çiz
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

    // Diğer Hastaları (Noktaları) Çiz
    pts.forEach(([px, py, c], i) => {
      ctx.beginPath();
      ctx.arc(px * w, py * h, neighbors.has(i) ? 7 : 5, 0, Math.PI * 2);
      ctx.fillStyle =
        c === 1
          ? neighbors.has(i)
            ? "#B91C1C"
            : "rgba(185,28,28,0.35)"
          : neighbors.has(i)
            ? "#0D7A50"
            : "rgba(13,122,80,0.35)";
      ctx.fill();

      // Eğer komşuysa araya çizgi çek
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

    // Yeni Hastayı (Yıldız) Çiz
    const sx = newPt[0] * w,
      sy = newPt[1] * h,
      sr = 10;
    ctx.fillStyle = "#0D2340";
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const b = (i * 4 * Math.PI) / 5 + (2 * Math.PI) / 5 - Math.PI / 2;
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
          <button className="btn primary" onClick={onNext}>
            Next Step →
          </button>
        </div>
      </div>

      <div className="cols">
        {/* SOL PANEL: AYARLAR */}
        <div>
          <div className="card">
            <div className="card-title">Choose Algorithm</div>
            <div className="domain-bar" style={{ marginBottom: "15px" }}>
              <div
                className={`domain-pill ${activeModel === "knn" ? "active" : ""}`}
                onClick={() => setActiveModel("knn")}
              >
                KNN
              </div>
              <div
                className={`domain-pill ${activeModel === "svm" ? "active" : ""}`}
                onClick={() => setActiveModel("svm")}
              >
                SVM
              </div>
              <div
                className={`domain-pill ${activeModel === "dt" ? "active" : ""}`}
                onClick={() => setActiveModel("dt")}
              >
                Decision Tree
              </div>
            </div>

            {activeModel === "knn" && (
              <>
                <div
                  style={{
                    background: "var(--sky)",
                    padding: "12px",
                    borderRadius: "10px",
                    fontSize: "12px",
                    marginBottom: "15px",
                  }}
                >
                  <b>K-Nearest Neighbors (KNN)</b> — Finds the K most similar
                  past patients and predicts based on their outcomes.
                </div>
                <div className="card-title">Parameters</div>
                <label className="lbl">
                  K — Number of Similar Patients to Compare: <b>{knnK}</b>
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={knnK}
                  onChange={(e) => setKnnK(e.target.value)}
                  style={{ width: "100%", marginBottom: "15px" }}
                />
                <button className="btn teal" style={{ width: "100%" }}>
                  ⚡ Train Model
                </button>
              </>
            )}

            {activeModel !== "knn" && (
              <p style={{ color: "var(--mid)", fontSize: "13px" }}>
                This model's parameters will be available soon.
              </p>
            )}
          </div>
        </div>

        {/* SAĞ PANEL: GRAFİK VE SONUÇLAR */}
        <div>
          {activeModel === "knn" ? (
            <div className="card">
              <div className="card-title">
                KNN Visualisation — How the Algorithm Thinks
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--mid)",
                  marginBottom: "10px",
                }}
              >
                Each dot is a past patient. The ★ is a new patient. The
                highlighted ring shows the <b>{knnK}</b> nearest neighbours used
                to make the prediction.
              </p>

              {/* CANVAS: Grafiğin çizildiği yer */}
              <canvas
                ref={canvasRef}
                style={{
                  width: "100%",
                  height: "240px",
                  background: "var(--paper)",
                  borderRadius: "12px",
                  border: "1px solid var(--line)",
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  marginTop: "15px",
                  fontSize: "11px",
                  color: "var(--mid)",
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "var(--bad)",
                    }}
                  ></div>{" "}
                  Readmitted
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "var(--good)",
                    }}
                  ></div>{" "}
                  Not Readmitted
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  ★ New Patient
                </span>
              </div>
            </div>
          ) : (
            <div
              className="card"
              style={{
                textAlign: "center",
                padding: "50px 20px",
                color: "var(--muted)",
              }}
            >
              <h3>Select KNN to see the interactive visualization</h3>
            </div>
          )}
        </div>
      </div>

      {/* ALT BUTONLAR */}
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
        <button className="btn primary" onClick={onNext}>
          Next Step →
        </button>
      </div>
    </section>
  );
}
