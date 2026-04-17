import React from "react";

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "600px" }}>
        <h2>ℹ️ Help & Guide</h2>
        <p>
          Welcome to the <b>Health-AI ML Visualization Tool</b>, developed for healthcare professionals under the Erasmus+ KA220-HED framework.
        </p>
        <p>
          This tool will guide you through the complete Machine Learning lifecycle specifically tailored for clinical datasets:
        </p>
        <ul style={{ textAlign: "left", marginBottom: "20px", paddingLeft: "20px", display: "grid", gap: "8px" }}>
          <li><b>Step 1:</b> Explore and select your clinical domain.</li>
          <li><b>Step 2:</b> Load a dataset (CSV) and select the clinical target you want to predict.</li>
          <li><b>Step 3:</b> Handle missing data and class imbalances to ensure a robust model.</li>
          <li><b>Step 4:</b> Train various ML algorithms and observe their performance.</li>
          <li><b>Step 5:</b> Compare models side-by-side using clinical evaluation metrics.</li>
          <li><b>Step 6:</b> Understand model decisions using Feature Importance (Explainability).</li>
          <li><b>Step 7:</b> Generate a final assessment certificate.</li>
        </ul>
        <button
          className="btn-next"
          onClick={onClose}
          style={{ width: "100%", marginTop: "10px" }}
        >
          Got it, Close
        </button>
      </div>
    </div>
  );
}
