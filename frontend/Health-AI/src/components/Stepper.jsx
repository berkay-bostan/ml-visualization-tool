import React from "react";

export default function Stepper({ currentStep, setCurrentStep, maxStepReached }) {
  const steps = [
    { id: 1, title: "Clinical Context", sub: "Use case & goals" },
    { id: 2, title: "Data Exploration", sub: "Upload & understand" },
    { id: 3, title: "Data Preparation", sub: "Clean & split data" },
    { id: 4, title: "Model & Parameters", sub: "Select & tune" },
    { id: 5, title: "Results", sub: "Metrics & matrix" },
    { id: 6, title: "Explainability", sub: "Why this prediction?" },
    { id: 7, title: "Ethics & Bias", sub: "Fairness check" },
  ];

  return (
    <div className="stepper">
      {steps.map((step) => {
        const isLocked = step.id > (maxStepReached || 1) + 1;
        return (
          <button
            key={step.id}
            className={`step-btn ${currentStep === step.id ? "active" : ""} ${currentStep > step.id ? "done" : ""} ${isLocked ? "locked" : ""}`}
            onClick={() => !isLocked && setCurrentStep(step.id)}
            style={isLocked ? { opacity: 0.4, cursor: "not-allowed" } : {}}
            title={isLocked ? "Complete previous steps first" : step.title}
          >
            <div className="step-num">
              <span>{isLocked ? "🔒" : step.id}</span>
            </div>
            <div className="step-label">
              <b>{step.title}</b>
              <small>{step.sub}</small>
            </div>
          </button>
        );
      })}
    </div>
  );
}
