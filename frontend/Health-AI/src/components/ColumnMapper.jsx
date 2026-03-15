import React, { useState, useEffect } from "react";

export default function ColumnMapper({
  isOpen,
  onClose,
  onSave,
  columns,
  currentTarget,
}) {
  const [selectedTarget, setSelectedTarget] = useState("");

  // Dışarıdan bir şey seçildiyse, modal açıldığında onu hatırla!
  useEffect(() => {
    if (currentTarget) {
      setSelectedTarget(currentTarget);
    }
  }, [currentTarget, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-back open">
      <div className="modal" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div className="modal-head">
          <div>
            <h3>Column Mapper & Schema Validator</h3>
            <p>
              Select which column represents the clinical outcome you want the
              AI to predict.
            </p>
          </div>
          <button className="btn outline" onClick={onClose}>
            ✕ Close
          </button>
        </div>

        <div
          className="modal-body"
          style={{ display: "block", padding: "20px" }}
        >
          <div className="card">
            <div className="card-title">Settings</div>

            <label className="lbl">
              Target Column (What We Are Predicting)
            </label>
            <select
              className="sel"
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
            >
              <option value="">-- Lütfen Hedef Sütunu Seçin --</option>
              {columns ? (
                columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))
              ) : (
                <option disabled>Önce CSV Yükleyin</option>
              )}
            </select>

            <div
              style={{
                marginTop: "12px",
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <span className="status-pill">
                <span
                  className={`s-pill-dot ${selectedTarget ? "ok" : "bad"}`}
                ></span>
                Schema:{" "}
                <b style={{ marginLeft: "5px" }}>
                  {selectedTarget ? "Valid" : "Needs Target"}
                </b>
              </span>
            </div>

            <div className="banner info" style={{ marginTop: "15px" }}>
              <div className="banner-icon">ℹ️</div>
              <div>
                <b>Rule:</b> You must select a Target Column to proceed to Step
                3.
              </div>
            </div>

            <div className="btn-row" style={{ marginTop: "20px" }}>
              <button
                className="btn teal"
                disabled={!selectedTarget}
                onClick={() => onSave(selectedTarget)}
                style={{ width: "100%", padding: "12px" }}
              >
                Save Mapping & Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
