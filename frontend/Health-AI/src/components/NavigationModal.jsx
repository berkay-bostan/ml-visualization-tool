import React from "react";

export default function NavigationModal({ isOpen, onClose, onGoToStep2 }) {
  if (!isOpen) return null; // Modal kapalıysa hiçbir şey render etme

  return (
    <div className="modal-back open">
      <div
        className="modal"
        style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center" }}
      >
        <div
          className="modal-head"
          style={{ border: "none", padding: "30px 30px 10px" }}
        >
          <h3 style={{ color: "var(--navy)", width: "100%" }}>
            🔒 Access Restricted
          </h3>
        </div>

        <div
          className="modal-body"
          style={{ display: "block", padding: "10px 30px 30px" }}
        >
          <div
            className="banner bad"
            style={{
              background: "#fef2f2",
              borderColor: "#fca5a5",
              padding: "15px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div style={{ fontSize: "24px" }}>🛑</div>
            <div
              style={{
                color: "#991b1b",
                fontSize: "14px",
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              <b>Gate Locked:</b> You cannot proceed to Step 3 or beyond without
              defining a Target Column. Please select a column in Step 2 first.
            </div>
          </div>

          <div
            className="btn-row"
            style={{
              marginTop: "25px",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <button
              className="btn outline"
              style={{ flex: 1 }}
              onClick={onClose}
            >
              ✕ Close
            </button>
            <button
              className="btn teal"
              style={{ flex: 1 }}
              onClick={onGoToStep2}
            >
              Go to Step 2 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
