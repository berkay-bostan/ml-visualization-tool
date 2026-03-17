ML Visualization Tool
User Guide for Healthcare Professionals/Students
February 2025  ·  Version 1.0
Prepared by Dr. Sevgi Koyuncu Tunç

✅  No technical experience needed
This tool runs entirely in your web browser. There is nothing to install, no command line to use, and no coding required. If you can browse the internet, you can use this tool.

 
1.  What Is This Tool?
The ML Visualization Tool helps doctors, nurses, and other healthcare professionals understand how artificial intelligence and machine learning work in real clinical settings — without any technical background.

You will work through seven guided steps that take you from choosing a medical specialty, all the way through uploading patient data, training an AI model, and interpreting the results. Every screen uses plain clinical language, and every number is explained in terms of patient outcomes.

🏥  Who Is This For?
Doctors, nurses, clinical researchers, and allied health professionals. No computer science background is required. You should be able to complete the full walkthrough in under 45 minutes.

How to Get Started
Open the tool in any modern web browser (Chrome, Firefox, Edge, or Safari). You will see the main screen with the navigation bar at the top and a row of medical specialty buttons below it. No login is required for educational use.

2.  Step 0 — Choose Your Medical Specialty
Before you begin, select the medical area you want to explore. The tool supports 20 clinical specialties. Click the relevant button at the top of the screen; the entire tool will update to use data and language relevant to that specialty.

⚠️  Switching specialty resets the pipeline
If you change your specialty after you have already started working, the tool will ask you to confirm. All your current progress will be reset and you will return to Step 1.











Table 1. Medical Specialties And Sample Datasets
#	Specialty	What the AI Predicts	Data Source	Target Variable
1	Cardiology	30-day readmission risk after heart failure discharge	Heart Failure Clinical Records	DEATH_EVENT (binary)
2	Radiology	Normal vs. pneumonia from clinical features	NIH Chest X-Ray metadata	Finding Label (binary/multi)
3	Nephrology	Chronic kidney disease stage from routine lab values	UCI CKD Dataset (400 patients)	classification (CKD / not CKD)
4	Oncology — Breast	Malignancy of a breast biopsy from cell measurements	Wisconsin Breast Cancer Dataset	diagnosis (M/B)
5	Neurology — Parkinson's	Parkinson's disease from voice biomarkers	UCI Parkinson's Dataset	status (0/1)
6	Endocrinology — Diabetes	Diabetes onset within 5 years from metabolic markers	Pima Indians Diabetes Dataset	Outcome (0/1)
7	Hepatology — Liver	Liver disease from blood test results	Indian Liver Patient Dataset	Dataset (liver disease y/n)
8	Cardiology — Stroke	Stroke risk from demographics and comorbidities	Kaggle Stroke Prediction Dataset	stroke (0/1)
9	Mental Health	Depression severity from PHQ-9 survey responses	Kaggle Depression/Anxiety Dataset	severity class
10	Pulmonology — COPD	COPD exacerbation risk from spirometry data	Kaggle / PhysioNet COPD Dataset	exacerbation (y/n)
11	Haematology — Anaemia	Type of anaemia from full blood count results	Kaggle Anaemia Classification Dataset	anemia_type (multi-class)
12	Dermatology	Benign vs. malignant skin lesion from dermoscopy features	HAM10000 metadata (Kaggle)	dx_type (benign / malignant)
13	Ophthalmology	Diabetic retinopathy severity from clinical findings	UCI / Kaggle Retinopathy Dataset	severity grade
14	Orthopaedics — Spine	Normal vs. disc herniation from biomechanical measures	UCI Vertebral Column Dataset	class (Normal / Abnormal)
15	ICU / Sepsis	Sepsis onset from vital signs and lab results	PhysioNet / Kaggle Sepsis Dataset	SepsisLabel (0/1)
16	Obstetrics — Fetal Health	Fetal cardiotocography classification (normal / suspect / pathological)	UCI Fetal Health Dataset	fetal_health (1/2/3)
17	Cardiology — Arrhythmia	Cardiac arrhythmia presence from ECG features	UCI Arrhythmia Dataset	arrhythmia (0/1)
18	Oncology — Cervical	Cervical cancer risk from demographic and behavioural data	UCI Cervical Cancer Dataset	Biopsy (0/1)
19	Thyroid / Endocrinology	Thyroid function classification (hypo / hyper / normal)	UCI Thyroid Disease Dataset	class (3 types)
20	Pharmacy — Readmission	Hospital readmission risk for diabetic patients on medication	UCI Diabetes 130-US Hospitals Dataset	readmitted (<30 / >30 / NO)


3.  The Seven-Step Journey
Once you have chosen your specialty, the tool guides you through seven steps. A progress bar at the top of the screen always shows where you are. Some steps are locked until you complete the previous one — the tool will tell you what action is needed to unlock the next step.

Table 2. List Of Steps In The Visualisation Tool
Step	Name	What You Do	Access
1	Clinical Context	Read about the medical problem the AI is trying to solve in your chosen specialty.	Always available
2	Data Exploration	Upload a patient dataset (or use the built-in example) and review the data.	Always available
3	Data Preparation	Choose how to handle missing values, normalise measurements, and split data into training and test groups.	Unlocks after Step 2 is validated
4	Model & Parameters	Select one of six AI model types and adjust its settings using sliders.	Unlocks after Step 3
5	Results	See how well the AI performed, including how many patients were correctly identified.	Unlocks after Step 4
6	Explainability	Find out which measurements mattered most and why the AI made a specific prediction for a patient.	Unlocks after Step 5
7	Ethics & Bias	Check whether the AI treats different patient groups fairly and review an EU AI Act compliance checklist.	Always available

 
Step 1 — Clinical Context
This screen introduces you to the clinical problem the AI is trying to solve. You will see a description of the medical condition, the patient population, and what outcome the AI is predicting — for example, whether a heart failure patient is at risk of being readmitted within 30 days.

You do not need to do anything on this screen other than read and familiarise yourself with the context. When you are ready, click Next to move to Step 2.
 
Figure 1: Clinical Context UI Design Sample



Step 2 — Data Exploration
This is where you decide which patient data to use. You have two options:

•	Use the built-in example dataset — pre-loaded data from a published clinical study, ready to use immediately.
•	Upload your own CSV file — a spreadsheet of patient records from your institution, with one row per patient and one column per measurement.

🔒  Your data is private
If you upload your own file, it is used only within your current browser session and is never saved to any server or shared with anyone. The privacy notice is displayed on every screen.

 
Figure 2. Data Exploration UI Design Sample

If you upload your own data, the file must:
•	Be a .csv file (a spreadsheet saved as comma-separated values)
•	Be no larger than 50 MB
•	Have at least 10 rows (patients) and at least one numeric measurement column
After loading data, you will see:
•	A summary of each column — whether it contains missing values and whether any action is needed.
•	A breakdown showing how many patients fall into each outcome category (for example, Readmitted vs. Not Readmitted).
•	A warning if one outcome is much rarer than the other, which can affect model performance.

🔑  Required before moving to Step 3
You must open the Column Mapper, confirm which column represents the patient outcome you want to predict, and click Save. The screen will show a green confirmation message once this is done. Without this, Step 3 remains locked.
 
Figure 2.1.  Column Mapper UI Design Sample 
Step 3 — Data Preparation
Before the AI can learn from patient data, the data needs to be cleaned and prepared. This step lets you control how that preparation is done, using plain-language options with no technical knowledge required.

 
Figure 3. Data Preparation UI Design Sample
Training vs. Testing Split
Slide the control to choose what percentage of patients the AI learns from (training), and what percentage are held back to test how well the AI performs (testing). For example, 80% training / 20% testing means the AI learns from 80% of patients and is then tested on the remaining 20%, which it has never seen.




Missing Values
If some patients have missing measurements, choose how to handle them:
•	Median (recommended) — fill in the missing value using the middle value from similar patients.
•	Mode — use the most common value.
•	Remove patients — exclude any patient with a missing value from the analysis.

Normalisation
Different measurements are recorded on very different scales — for example, age ranges from 0 to 100, while a troponin level might range from 0 to 50,000. Normalisation rescales all measurements so they are comparable, which prevents any single measurement from dominating the AI's decisions.
•	Z-score (recommended) — rescales each measurement relative to the average and spread across all patients.
•	Min-Max — rescales everything to a 0–1 range.
•	None — use only if you have a specific reason to skip this step.

Class Imbalance (shown only if relevant)
If one outcome is much rarer than the other — for example, only 5% of patients in the dataset were actually readmitted — the AI may learn to always predict the majority outcome and appear accurate while missing all real cases. The SMOTE option creates additional synthetic examples of the rare outcome to help the AI learn from it properly. This is applied only to the training data and never to the test patients.

Click Apply Preparation Settings when you are ready. The screen will show a side-by-side comparison of your data before and after the preparation steps.

 
Step 4 — Choosing and Tuning the AI Model
This step lets you choose which type of AI model to train and adjust its settings. There are six model types available. You can switch between them at any time and compare their performance.
 
Figure 4. Model Selection UI Design Sample













Table 3. The Six AI Model Types
Model	How It Works (Plain Language)	What You Can Adjust
K-Nearest Neighbors (KNN)	Compares a new patient to the K most similar historical patients and predicts the same outcome as the majority. Like asking the nearest neighbours what they experienced.	K — how many past patients to compare (1–25). Distance measure — straight-line vs. city-block similarity.
Support Vector Machine (SVM)	Finds the clearest dividing line between two groups of patients in the data. Good at separating complex, curved patterns.	Kernel — shape of the decision boundary. C (Strictness) — how hard the model tries to correctly classify every training patient.
Decision Tree	Asks a series of yes/no questions about patient measurements and follows the branches to reach a prediction — like a clinical decision pathway.	Maximum Depth — how many questions the model can ask. More questions = more complex, but risks memorising training patients.
Random Forest	Trains many decision trees simultaneously, each slightly different, then takes a majority vote. More stable and accurate than a single tree.	Number of Trees — more trees means more stable results but takes longer to train. Maximum Depth Per Tree — complexity of each individual tree.
Logistic Regression	Calculates the probability that a patient belongs to one outcome group, based on a weighted combination of their measurements.	C (Regularisation) — smaller value = simpler model, less likely to overfit. Maximum Iterations — how long the model trains before stopping.
Naive Bayes	Uses probability theory to estimate how likely each outcome is, given a patient's measurements. Very fast and transparent.	Variance Smoothing — a technical stability setting that rarely needs changing. Good for seeing quick, interpretable results.

Auto-Retrain
When Auto-Retrain is on (the default), the model automatically retrains itself whenever you move a slider. The results update in real time so you can immediately see the effect of your changes. For very large datasets (over 10,000 patients) you may want to turn this off and click Train Model manually.

Comparing Models
Click the + Compare button after training a model to add it to the comparison table. The table shows accuracy, sensitivity, specificity, and AUC side by side so you can see which model performs best for your specialty.

 
Step 5 — Understanding the Results
This is the core of the tool — where you see how well the AI performed on patients it has never seen before. Every number is explained in plain clinical language.

 
Figure 5. Results and Evaluation UI Design Sample

🚨  Low Sensitivity Warning
If the model misses more than half of the patients who actually had the condition (Sensitivity below 50%), a red warning banner will appear. Return to Step 4 and try a different model or adjust the parameters before drawing any conclusions.

Table 4. The Six Performance Measures
Measure	What It Means in Clinical Terms	When to Be Concerned
Accuracy	Out of all test patients, what percentage did the AI classify correctly?	Below 65% — the model is not performing reliably.
Sensitivity ⭐	Of patients who WERE readmitted (or had the condition), how many did the AI catch?	Below 70% — the model is missing too many real cases. This is the most important measure for any screening task.
Specificity	Of patients who were NOT readmitted, how many did the AI correctly identify as safe?	Below 65% — too many unnecessary follow-up actions or referrals.
Precision	Of all patients the AI flagged as high-risk, how many actually were high-risk?	Below 60% — many false alarms, which waste clinical resources.
F1 Score	A combined score balancing Sensitivity and Precision. Useful when both missing cases and false alarms have real costs.	Below 65% — the model struggles to balance catching cases and avoiding false alarms.
AUC-ROC	A 0.5–1.0 score for how well the model separates high-risk from low-risk patients overall. 0.5 = no better than chance; 1.0 = perfect.	Below 0.75 — the model cannot reliably distinguish between patient groups.


The Confusion Matrix
The confusion matrix is a 2×2 table showing exactly what the AI got right and wrong for your test patients. Each cell uses plain labels and colour coding:

	AI Predicted: NOT at Risk	AI Predicted: AT RISK
Actually NOT at Risk	✅  Correctly called safe
(True Negative)	⚠️  Unnecessary alarm — patient was fine
(False Positive — costs resources but not a safety risk)
Actually AT RISK	❌  MISSED — patient returned to hospital
(False Negative — the most dangerous error)	✅  Correctly flagged as high-risk
(True Positive)

ROC Curve
The ROC curve is a graph that shows how well the model can separate high-risk patients from low-risk ones at different decision thresholds. A model that hugs the top-left corner of the graph is performing well. A diagonal line would mean the model is no better than guessing at random.

 
Step 6 — Why Did the AI Make That Prediction?
This step answers the most important clinical question: which measurements drove the AI's prediction, and why did it predict what it did for a specific patient?
 
Figure 6. Explainability Step UI Design Sample
Overall Feature Importance: A ranked bar chart shows which measurements had the most influence on the model's predictions across all patients. Measurements are displayed using their clinical names (for example, Ejection Fraction rather than a database column name). A clinical sense-check note below the chart explains whether the top-ranked feature is consistent with established clinical knowledge.
Single-Patient Explanation: Select a specific test patient from the dropdown. The tool will show a waterfall chart explaining what pushed the AI's prediction towards high risk (shown in red) and what pushed it towards low risk (shown in green), for that individual patient. Each bar is labelled in plain language — for example, 'Ejection Fraction very low (20%)' rather than a raw data value.

⚕️  Important Clinical Reminder
These explanations show associations between measurements and outcomes in the training data — they do not prove causation. A clinician must always decide whether and how to act on any AI prediction. The tool is an educational aid, not a diagnostic device.
Step 7 — Ethics and Fairness
An AI model that is accurate on average can still perform poorly for specific groups of patients. This step checks whether the model treats all patient groups equitably, and walks you through a practical checklist for responsible AI use.
 
Figure 7. Ethics & Bias Step UI Design Sample

Subgroup Performance Table
The table shows how the model performs separately for male patients, female patients, and three age groups (18–60, 61–75, and 76+). For each group, accuracy, sensitivity, and specificity are shown with colour coding (green = acceptable, amber = review recommended, red = action needed).

🔴  Automatic Bias Warning
If any patient subgroup's Sensitivity is more than 10 percentage points lower than the overall average, a red banner appears automatically — for example: 'Bias Detected: Sensitivity for female patients (41%) is 26 percentage points lower than for male patients (67%). This model should NOT be deployed until this gap is addressed.'

EU AI Act Compliance Checklist
Eight yes/no items reflect the key requirements for responsible AI use in healthcare under the EU AI Act. Work through each item and tick the box when you are satisfied that your project meets that requirement. Two items are pre-checked based on actions already completed in previous steps.

Table 5. EU AI Act Compliance Checklist
Checklist Item	Pre-checked?	Action Required
Model outputs include explanations (completed in Step 6)	✅ Yes	None — Step 6 completes this
Training data source is documented (shown in Step 2)	✅ Yes	None — Step 2 completes this
Subgroup bias audit completed	No	Review the subgroup table above and confirm
Human oversight plan defined — a clinician will review all AI predictions	No	Confirm your team has a process for this
Patient data privacy protected (GDPR)	No	Confirm no identifiable patient data was used
Plan in place to monitor model performance over time	No	Confirm your institution has a monitoring process
Pathway defined for reporting AI-related incidents	No	Confirm your institution has a reporting pathway
Clinical validation completed before any real-world use	No	Confirm this has been carried out



Training Data Representation
A chart compares the gender and age profile of the training dataset against the real hospital population. If any group is under-represented by more than 15 percentage points, a warning banner appears. Under-representation means the AI has had less opportunity to learn from that group, which may reduce its accuracy for those patients.

Real-World AI Failure Case Studies
Three short case study cards illustrate how AI tools have failed in real clinical settings, and what can be done to prevent similar failures. These are designed to be read by clinicians with no AI background and are included to ground the learning experience in real consequences.

Download Your Summary Certificate
When you have completed all seven steps, click Download Summary Certificate. This generates a PDF document summarising the specialty you explored, the model you trained, all six performance measures, bias findings, and the status of your EU AI Act checklist. You can use this as evidence of completing the exercise.

 
Glossary — Key Terms Explained
This glossary is available inside the tool via the Help button in the top navigation bar. All definitions are written for healthcare professionals.

Term	What It Means
Algorithm	A set of step-by-step instructions a computer follows to find patterns in patient data and make predictions — like a fast, data-driven decision checklist.
Training Data	Historical patient records the model learns from. Similar to a doctor reviewing past cases before seeing new patients.
Test Data	Patients the model has never seen, used to measure how well the AI performs. If a model only works on training data, it has memorised rather than learned.
Features	The input measurements (columns in your data) used to make predictions — for example, age, blood pressure, creatinine level, smoking status.
Target Variable	The outcome the model is trying to predict — for example, readmission, diagnosis, survival, or disease stage.
Overfitting	When a model memorises the training cases so precisely that it fails on new patients. Like a student who memorises exam answers but cannot apply the knowledge.
Underfitting	When a model is too simple to learn anything useful. Like a clinician who gives the same diagnosis regardless of symptoms.
Normalisation	Adjusting all measurements to the same scale so no single measurement dominates because of its units. Age (0–100) and a troponin level (0–50,000) must be rescaled before they can be compared fairly.
Class Imbalance	When one outcome is much rarer than the other in the training data. A model trained on 95% negative cases may simply predict negative for everyone and appear 95% accurate — but miss all real cases.
SMOTE	Synthetic Minority Over-sampling Technique. Creates artificial examples of the rare outcome to balance the training data. Applied to training data only — never to test patients.
Sensitivity	Of all patients who truly have the condition, what fraction did the model correctly identify? Low sensitivity means the model misses real cases. Critical in any screening application.
Specificity	Of all patients who truly do not have the condition, what fraction did the model correctly call healthy? Low specificity means too many false alarms.
Precision	Of all patients the model flagged as positive, what fraction actually were? Low precision means many unnecessary referrals or treatments.
F1 Score	A single number that balances Sensitivity and Precision. Useful when both false negatives and false positives have real clinical costs.
AUC-ROC	A score from 0.5 (random guessing) to 1.0 (perfect separation) summarising how well the model distinguishes between positive and negative patients. Above 0.8 is considered good.
Confusion Matrix	A 2×2 table showing: correctly identified sick patients, correctly identified healthy patients, healthy patients incorrectly flagged as sick, and sick patients incorrectly called safe.
Feature Importance	A ranking of which patient measurements the model relied on most. Helps confirm whether the AI is using clinically meaningful signals.
Hyperparameter	A setting chosen before training that controls model behaviour — for example, K in KNN or tree depth in Decision Tree. Not learned from data; set by the user via sliders.
Bias (AI)	When a model performs significantly worse for certain patient subgroups (for example, older patients, women, or ethnic minorities) because they were under-represented in the training data.
Cross-Validation	Splitting the data multiple times and averaging results to get a more reliable performance estimate than a single train/test split.

