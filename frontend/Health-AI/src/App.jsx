import { useState } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import Stepper from "./components/Stepper";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import Step5 from "./components/Step5";
import Step6 from "./components/Step6";
import Step7 from "./components/Step7";
import NavigationModal from "./components/NavigationModal";

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState("Cardiology");

  // project.md'deki 20 uzmanlık alanı
  const domains = [
    "Cardiology",
    "Radiology",
    "Nephrology",
    "Oncology — Breast",
    "Neurology — Parkinson's",
    "Endocrinology — Diabetes",
    "Hepatology — Liver",
    "Cardiology — Stroke",
    "Mental Health",
    "Pulmonology — COPD",
    "Haematology — Anaemia",
    "Dermatology",
    "Ophthalmology",
    "Orthopaedics — Spine",
    "ICU / Sepsis",
    "Obstetrics — Fetal Health",
    "Cardiology — Arrhythmia",
    "Oncology — Cervical",
    "Thyroid / Endocrinology",
    "Pharmacy — Readmission",
  ];

  const [file, setFile] = useState(null);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [targetColumn, setTargetColumn] = useState("");
  const [trainResults, setTrainResults] = useState(null);
  const [prepResult, setPrepResult] = useState(null);

  // Navigasyon Modalı
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);

  // 🔄 RESET — Tüm uygulamayı sıfırla
  const handleReset = () => {
    setCurrentStep(1);
    setFile(null);
    setDatasetInfo(null);
    setTargetColumn("");
    setTrainResults(null);
    setPrepResult(null);
  };

  // Alan değiştirildiğinde tüm pipeline sıfırlansın (project.md'ye göre)
  const handleDomainChange = (domain) => {
    if (domain === selectedDomain) return;
    if (currentStep > 1 || file || datasetInfo) {
      const confirmed = window.confirm(
        "Switching specialty resets the pipeline. All your current progress will be reset and you will return to Step 1. Continue?"
      );
      if (!confirmed) return;
    }
    setSelectedDomain(domain);
    handleReset();
  };

  // 🛡️ GATEKEEPER
  const handleStepChange = (newStep) => {
    if (newStep < currentStep) {
      setCurrentStep(newStep);
      return;
    }
    if (newStep >= 3 && !targetColumn) {
      setIsNavModalOpen(true);
      setCurrentStep(2);
      return;
    }
    setCurrentStep(newStep);
  };

  const closeNavModal = () => setIsNavModalOpen(false);
  const goToStep2 = () => {
    setIsNavModalOpen(false);
    setCurrentStep(2);
  };

  return (
    <>
      <Navbar
        selectedDomain={selectedDomain}
        onReset={handleReset}
      />
      <div className="wrap">
        <div className="domain-bar">
          {domains.map((d) => (
            <div
              key={d}
              className={`domain-pill ${selectedDomain === d ? "active" : ""}`}
              onClick={() => handleDomainChange(d)}
            >
              {d}
            </div>
          ))}
        </div>

        <Stepper currentStep={currentStep} setCurrentStep={handleStepChange} />

        {currentStep === 1 && (
          <Step1
            selectedDomain={selectedDomain}
            onNext={() => handleStepChange(2)}
          />
        )}
        {currentStep === 2 && (
          <Step2
            onNext={() => handleStepChange(3)}
            onPrev={() => handleStepChange(1)}
            file={file}
            setFile={setFile}
            datasetInfo={datasetInfo}
            setDatasetInfo={setDatasetInfo}
            targetColumn={targetColumn}
            setTargetColumn={setTargetColumn}
          />
        )}
        {currentStep === 3 && (
          <Step3
            onNext={() => handleStepChange(4)}
            onPrev={() => handleStepChange(2)}
            file={file}
            targetColumn={targetColumn}
            prepResult={prepResult}
            setPrepResult={setPrepResult}
          />
        )}
        {currentStep === 4 && (
          <Step4
            onNext={() => handleStepChange(5)}
            onPrev={() => handleStepChange(3)}
            file={file}
            targetColumn={targetColumn}
            setTrainResults={setTrainResults}
          />
        )}
        {currentStep === 5 && (
          <Step5
            onNext={() => handleStepChange(6)}
            onPrev={() => handleStepChange(4)}
            trainResults={trainResults}
          />
        )}
        {currentStep === 6 && (
          <Step6
            onNext={() => handleStepChange(7)}
            onPrev={() => handleStepChange(5)}
            file={file}
            targetColumn={targetColumn}
            selectedDomain={selectedDomain}
          />
        )}
        {currentStep === 7 && (
          <Step7
            onPrev={() => handleStepChange(6)}
            trainResults={trainResults}
          />
        )}
      </div>

      <NavigationModal
        isOpen={isNavModalOpen}
        onClose={closeNavModal}
        onGoToStep2={goToStep2}
      />
    </>
  );
}

export default App;
