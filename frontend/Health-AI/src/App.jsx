import { useState } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import Stepper from "./components/Stepper";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import Step5 from "./components/Step5";
import Step6 from "./components/Step6"; // Yeni eklendi
import Step7 from "./components/Step7"; // Yeni eklendi

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState("Cardiology");
  const domains = [
    "Cardiology",
    "Nephrology",
    "Oncology",
    "Neurology",
    "Diabetes",
    "Pulmonology",
    "Sepsis / ICU",
  ];

  // Backend'e gidip gelen veriler
  const [file, setFile] = useState(null);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [targetColumn, setTargetColumn] = useState("");

  return (
    <>
      <Navbar selectedDomain={selectedDomain} />

      <div className="wrap">
        <div className="domain-bar">
          {domains.map((d) => (
            <div
              key={d}
              className={`domain-pill ${selectedDomain === d ? "active" : ""}`}
              onClick={() => setSelectedDomain(d)}
            >
              {d}
            </div>
          ))}
        </div>

        <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep} />

        {currentStep === 1 && (
          <Step1
            selectedDomain={selectedDomain}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <Step2
            onNext={() => setCurrentStep(3)}
            onPrev={() => setCurrentStep(1)}
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
            onNext={() => setCurrentStep(4)}
            onPrev={() => setCurrentStep(2)}
            file={file}
            targetColumn={targetColumn}
          />
        )}
        {currentStep === 4 && (
          <Step4
            onNext={() => setCurrentStep(5)}
            onPrev={() => setCurrentStep(3)}
          />
        )}
        {currentStep === 5 && (
          <Step5
            onNext={() => setCurrentStep(6)}
            onPrev={() => setCurrentStep(4)}
          />
        )}
        {currentStep === 6 && (
          <Step6
            onNext={() => setCurrentStep(7)}
            onPrev={() => setCurrentStep(5)}
          />
        )}
        {currentStep === 7 && <Step7 onPrev={() => setCurrentStep(6)} />}
      </div>
    </>
  );
}

export default App;
