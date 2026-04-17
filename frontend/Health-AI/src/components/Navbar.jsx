import React, { useState, useRef, useEffect } from "react";

export default function Navbar({ selectedDomain, onReset }) {
  const [showHelp, setShowHelp] = useState(false);
  const helpRef = useRef(null);

  // Dışarıya tıklanınca popup'ı kapat
  useEffect(() => {
    function handleClickOutside(event) {
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setShowHelp(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="nav">
      <div className="nav-brand">
        <div className="nav-logo">H</div>
        <div>
          <div className="nav-title">HEALTH-AI · ML Learning Tool</div>
          <div className="nav-subtitle">
            Erasmus+ KA220-HED · For Healthcare Professionals
          </div>
        </div>
      </div>
      <div className="nav-right">
        <div className="nav-chip">
          <span className="nav-chip-dot"></span> Domain:{" "}
          <b style={{ color: "white", marginLeft: "4px" }}>
            {selectedDomain || "Loading..."}
          </b>
        </div>
        <button className="nav-btn" onClick={onReset}>
          ↺ Reset
        </button>
        <div style={{ position: "relative" }} ref={helpRef}>
          <button
            className="nav-btn"
            style={{ background: "var(--teal)", borderColor: "var(--teal)" }}
            onClick={() => setShowHelp(!showHelp)}
          >
            ? Help
          </button>

          {/* Help Pop-up Balloon */}
          {showHelp && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 12px)",
                right: 0,
                width: "300px",
                backgroundColor: "white",
                color: "var(--text-main)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                borderRadius: "12px",
                padding: "16px",
                zIndex: 1000,
                fontSize: "0.9rem",
                lineHeight: "1.5",
                border: "1px solid var(--border-light)",
                textAlign: "left"
              }}
            >
              {/* Balloon Arrow */}
              <div
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "15px",
                  width: "0",
                  height: "0",
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderBottom: "8px solid white",
                }}
              ></div>
              
              <h4 style={{ marginTop: 0, color: "var(--teal)", marginBottom: "10px", fontSize: "1rem" }}>
                ℹ️ How to Use
              </h4>
              <p style={{ margin: "0 0 10px 0" }}>This tool walks you through a complete ML pipeline:</p>
              <ul style={{ paddingLeft: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                <li><b>Step 1:</b> Select Domain</li>
                <li><b>Step 2:</b> Load Data & Set Target</li>
                <li><b>Step 3:</b> Preprocessing</li>
                <li><b>Step 4:</b> Model Training</li>
                <li><b>Step 5:</b> Evaluation Metrics</li>
                <li><b>Step 6:</b> Feature Importance</li>
                <li><b>Step 7:</b> Assessment Certificate</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
