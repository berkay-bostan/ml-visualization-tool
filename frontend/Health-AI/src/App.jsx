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
import NavigationModal from "./components/NavigationModal"; // YENİ: Modalı import et

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
    "Fetal Health",
    "Dermatology",
    "Stroke Risk",
  ];

  const [file, setFile] = useState(null);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [targetColumn, setTargetColumn] = useState("");
  const [trainResults, setTrainResults] = useState(null);

  // YENİ: Navigasyon Modalı'nın açık/kapalı durumunu tutan state
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);

  // 🛡️ GATEKEEPER FONKSİYONU (GÜNCELLENDİ)
  const handleStepChange = (newStep) => {
    // 1. KURAL: Kullanıcı geriye gitmek istiyorsa her zaman izin ver
    if (newStep < currentStep) {
      setCurrentStep(newStep);
      return;
    }

    // 2. KURAL: (SENİN İSTEDİĞİN ZORUNLULUK - MODAL İLE)
    // Eğer kullanıcı 3. veya daha ileri bir adıma geçmeye çalışıyorsa ve Hedef Sütun yoksa:
    if (newStep >= 3 && !targetColumn) {
      // alert'i sildik, yerine modalı açıyoruz!
      setIsNavModalOpen(true);
      setCurrentStep(2); // Zorla Step 2'ye geri at
      return;
    }

    // Eğer tüm kurallardan başarıyla geçerse adımı değiştir
    setCurrentStep(newStep);
  };

  // Modalı kapatan fonksiyon
  const closeNavModal = () => {
    setIsNavModalOpen(false);
  };

  // Modaldaki "Go to Step 2" butonuna basınca Step 2'ye zorla götüren fonksiyon
  const goToStep2 = () => {
    setIsNavModalOpen(false); // Önce modalı kapat
    setCurrentStep(2); // Sonra zorla Step 2'ye at
  };

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

        {/* Stepper'a Gatekeeper'ı veriyoruz */}
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
          />
        )}
        {currentStep === 7 && <Step7 onPrev={() => handleStepChange(6)} />}
      </div>

      {/* YENİ: Navigasyon Modalı'nı buraya ekliyoruz */}
      <NavigationModal
        isOpen={isNavModalOpen}
        onClose={closeNavModal}
        onGoToStep2={goToStep2}
      />
    </>
  );
}

export default App;
