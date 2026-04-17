import React from "react";

export default function Navbar({ selectedDomain, onReset, onHelpClick }) {
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
        <button
          className="nav-btn"
          style={{ background: "var(--teal)", borderColor: "var(--teal)" }}
          onClick={onHelpClick}
        >
          ? Help
        </button>
      </div>
    </nav>
  );
}
