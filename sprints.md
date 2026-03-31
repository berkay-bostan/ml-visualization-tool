Sprint 2 
First 3 steps of ML Visualisation Tool will be completed: 

Clinical Context
Data Exploration
Data Preparation
Artifact / Deliverable

Tool / Format

Working App — Steps 1–3 Complete

GitHub + live demo URL— all Step 2 right panel content; Column Mapper save gates Step 3; Step 3 controls all functional

Column Mapper Modal

GitHub — validate → save flow; schemaOK state gates navigation to Step 3; red blocked banner on bypass attempt

Step 3 Before/After Charts

GitHub — before/after normalisation bars; before/after SMOTE class balance bars; green success banner

Test Report — Sprint 2

PDF uploaded to GitHub Wiki — manual test cases for all Step 2 + Step 3 user stories; pass/fail status per story

Progress Report

 

📄  Weekly Progress Report — Required Sections

Header: Group name · Week number · Scrum Master name · Date submitted · Domains implemented so far (cumulative count out of 20).

1. Burndown Chart — screenshot from Jira showing remaining story points vs. ideal burndown line.

2. Completed This Week — list each user story ID + title + story points that moved to Done.

3. In Progress — list each story currently in progress with % completion estimate.

4. Blocked / At Risk — list any blocked tasks, their blocker, and the resolution plan.

5. Key Decisions Made — 2–3 sentences on any technical or design decisions taken this week (e.g., changed normalisation approach, added new API field).

6. Test Results — for each completed story: acceptance criteria status (Pass / Fail / Partial), screenshot of evidence.

7. Metrics — fill in the metrics table for the current sprint (see sprint-specific metrics in each delivery info).

8. Next Week Plan — list stories planned for the following week with assignees.

9. Retrospective Note (even weeks only) — 1 Keep, 1 Improve, 1 Try from this sprint's retro.

Sprint 2 Metrics
Metric

What to Measure

Target / Threshold

CSV Upload Success Rate

Test with 5 valid + 5 invalid files

100% correct handling (accept valid, reject invalid with friendly error)

Column Mapper Gate

Attempt Step 3 before and after save

Step 3 blocked before save; accessible after save — 0 bypass bugs

Step 3 Controls

All 4 dropdowns + slider functional

All options selectable; apply button triggers API call

Domain Count (Step 1)

How many domains update Step 1 text correctly

All 20 domains return correct clinical context text

Test Coverage

User stories with passing test cases ÷ total done stories

100% of completed stories have passing tests



SPRINT 3: ML Tool’s Steps 4( Model & Parameters)–5(Results)
Artifact / Deliverable

Tool / Format

Sprint 3 Backlog (Jira)

Jira — Sprint 3 stories committed

6-Model Tab Bar

GitHub — all 6 tabs render; clicking switches active tab; parameter panel shows/hides per model

Model Parameter Panel

GitHub —e.g. K slider (1–25); distance dropdown; KNN scatter canvas redraws on K change ≤ 16 ms

All model sliders and dropdowns functional; tooltips with clinical plain-language descriptions

Auto-Retrain Toggle

GitHub — debounced API call after 300 ms on slider change; banner shows/hides correctly

Clinical Tooltip Review

GitHub Wiki — screenshot of each model's parameter tooltips; instructor reviews clinical accuracy

Step 5: 

GitHub — all 6 metrics with colour thresholds (green/amber/red); clinical interpretation sentence per metric

Confusion Matrix:

 

GitHub — 2×2 grid with TN/FP/FN/TP; colour coding; plain-language labels; FN red banner; FP info banner

ROC Curve: 

 

GitHub — Implement ROC Curve (SVG inline); diagonal reference line; AUC annotated; explanatory note below chart

Low Sensitivity Danger Banner: 

 

GitHub — red banner auto-appears when Sensitivity < 50%; hides otherwise

Model Comparison Table: Implement the Model Comparison table with + Compare button

GitHub — + Compare adds row; Sensitivity column colour-coded; no duplicate rows

Test Report — Sprint 3

PDF uploaded to GitHub Wiki — test cases for all Step 4 + Step 5 stories; performance timing tests (model train < 3s)

Weekly progress report

already explained in sprint 2 delivery list

📋  Week 5 Showcase Agenda (Wednesday, 5 min per group)

o   Show Jira Sprint 3 board and burndown chart.

o   Full demo: train KNN → see metrics update → confusion matrix → ROC curve → switch to Random Forest → + Compare → comparison table.

o   Trigger the Low Sensitivity danger banner (set K very high or use a bad split) and show it appears.

o   Instructor gate: All 6 models must train successfully and all 6 metrics must update before Sprint 4.

o   Instructor checks: Does the KNN canvas redraw smoothly? Do tooltips use plain clinical language?

Metric

What to Measure

Target / Threshold

Model Training Latency

POST /api/train response time

< 3,000 ms for dataset ≤ 50,000 rows

Slider Debounce

Time from slider release to API call

300 ms ± 50 ms

KNN Canvas Redraw

Time from K change to canvas repaint

≤ 16 ms (single animation frame)

Danger Banner Trigger

Sensitivity < 50% scenario tested

Banner appears; banner hides when Sensitivity ≥ 50%

Metric Colour Thresholds

All 6 metrics tested at boundary values

Green/amber/red correct for all 6 metrics at all thresholds

Comparison Table

Add 6 models one by one

No duplicates; Sensitivity colour-coded correctly

Domain Switching (Steps 4–5)

Switch domain, retrain, check metrics update

Results and metrics update correctly for at least 5 domains tested



SPRINT 4: Full Pipeline: ML Tool’s Steps 6 & 7

Explainability · Feature importance · Ethics checklist · Bias auto-detection

Artifact / Deliverable

Tool / Format

Sprint 4 Backlog (Jira)

Jira  (submit URL)— Sprint 4 stories committed; story points; sub-tasks for Steps 6 and 7

Feature Importance Chart

GitHub  (submit URL)— horizontal bars sorted descending; clinical display names (not column names); values 0.00–1.00

Clinical Sense-Check Banner

GitHub  (submit URL)— domain-specific clinical sense-check text implemented for all 20 domains; correct text appears when switching domains

Patient Selector + Waterfall

GitHub  (submit URL)— dropdown shows 3 test patients; waterfall bars in red (risk) / green (safe); plain-language labels

Caution and Info Banners

GitHub  (submit URL)— amber caution: 'associations not causes'; blue what-if banner with probability shift

Domain Clinical Review

GitHub Wiki page  (submit URL)— for each of the 20 domains, team documents why the top 3 predicted features make clinical sense. Organised as a table: Domain | Top Feature | Clinical Justification.

Step 7 — Subgroup Table

GitHub — rows for male/female/age groups; Sensitivity colour-coded; Fairness column with OK/Review/⚠ tags

Bias Auto-Detection Banner

GitHub  (submit URL)— red full-width banner auto-appears when any subgroup Sensitivity is > 10 pp below overall; hides otherwise

EU AI Act Checklist

GitHub  (submit URL)— 8 items; 2 pre-checked; clicking toggles; visually shows completion progress

Training Data Chart

GitHub  (submit URL)— training vs. real population comparison bars; amber warning if > 15 pp gap in any group

AI Failure Case Studies

GitHub  (submit URL)— 3 cards: 1 red failure, 1 amber near-miss, 1 green prevention; plain clinical language

PDF Certificate Generation

GitHub  (submit URL)— POST /api/generate-certificate working; PDF includes the currently active domain, model, 6 metrics, bias findings, checklist status; tested for at least 3 different domains

Full Pipeline Test Report

PDF uploaded to GitHub Wiki  (submit URL)— end-to-end test: Steps 1–7 with a fresh CSV; all acceptance criteria verified

Weekly Progress Report

PDF uploaded to GitHub Wiki (submit URL)— velocity, demo screenshots, any stories carried over to Sprint 5

📋  Week 9 Showcase Agenda (Wednesday, 5 min per group)

Jira board and burndown.
Demo Step 6: show feature importance chart, explain top 3 features clinically, select a patient and show waterfall bars.
Switch between 3 different domains and show that the clinical sense-check banner text changes correctly for each.
Show the what-if info banner changing probability.
Instructor checks: Are feature names clinical (not database column names)? Does the clinical explanation change correctly across different domains?
Full demo of Step 7: show subgroup table, trigger the bias banner (use manipulated data if needed), tick EU AI Act checklist items, show failure case study cards.
Click Download Certificate and show generated PDF.
Instructor gate: Full 7-step pipeline must work end-to-end. Groups missing Steps 6 or 7 carry stories into Sprint 5 with penalty.
Sprint 4 Metrics
Metric

What to Measure

Target / Threshold

Bias Detection Accuracy

Test with subgroup gap exactly at 10 pp and 11 pp

Banner hidden at ≤ 10 pp; appears at > 10 pp

Checklist Toggle

Click all 8 items

All toggle correctly; 2 are pre-checked on load

Certificate Content

Download certificate for 3 different domains

Each PDF shows the correct domain name, model, 6 metrics, bias findings, checklist status

Certificate Generation Time

POST /api/generate-certificate timing

< 10 seconds

End-to-End Flow

Steps 1–7 with fresh CSV, no page reload

Zero crashes; all gates (schemaOK, step locks) work correctly

Clinical Language Audit

Count feature labels using database column names

0 raw column names visible to end user

Domain Count (Steps 6–7)

Run Steps 6 and 7 for multiple domains

Explainability and bias tables update correctly for all 20 domains



SPRINT 5  ·  

Polish, User Testing

Usability testing · Performance · Docker · Accessibility · Final jury presentation

  

User Testing Protocol
Each group must conduct a structured usability test. The participant must be a non-computer-science person with university-level education. The test must be completed independently (no coaching during the task).

 

Task

What the Participant Must Do

Success Criterion

Time Limit

T1

Open the tool, locate the domain pill bar, and switch between two different medical specialties.

Clicks correct pills; Step 1 content updates for each; no errors.

90 sec

T2

Upload the provided sample CSV file and open the Column Mapper.

CSV accepted and Column Mapper opens without error.

3 min

T3

Complete Column Mapper validation and proceed to Step 3.

Clicks Save; green banner appears; navigates to Step 3.

2 min

T4

Apply preparation settings in Step 3 and move to Step 4.

Clicks Apply; green success banner appears; opens Step 4.

3 min

T5

Train a KNN model and find the Sensitivity score in Step 5.

Correctly identifies the Sensitivity value and its colour.

3 min

T6

Find which patient measurement had the most influence on predictions (Step 6).

Names the top feature in the importance chart.

2 min

T7

Download the Summary Certificate.

PDF downloads successfully.

1 min

 

Week 10 Deliverables
 

Artifact / Deliverable

Tool / Format

Owner

Sprint 5 Backlog (Jira)

Jira — Sprint 5: remaining bugs, polish tasks, user testing stories, Docker story, documentation stories

Scrum Master

User Testing Report

PDF — participant profile (role, age, CS background), 7-task completion table, failure notes, participant quotes, SUS score

QA/Docs Lead

Signed Consent Forms

PDF — participant consent for video/observation (can be anonymised)

QA/Docs Lead

Usability Test Video

MP4 (5 min max) — screen recording of one participant completing Tasks T1–T7

QA/Docs Lead

Lighthouse Report Screenshot

PNG/PDF — Lighthouse scores for Performance, Accessibility, Best Practices, SEO

Lead Developer

Accessibility Fix Log

GitHub Wiki — list of violations found and how each was resolved

Lead Developer

Bug Fix Log

Jira — all bugs from Sprint 4 retrospective closed or documented

Lead Developer

Week 9 Progress Report

PDF uploaded to GitHub Wiki — burndown; user testing status; performance scores; Docker status

Scrum Master

 

📋  Week 10 Showcase Agenda (Wednesday, 5 min per group)

Show 3-min excerpt from usability test video. State: how many tasks did the participant complete independently?

Show Lighthouse report: performance score, accessibility score.

Show one resolved accessibility fix (before/after).

Docker: run 'docker-compose up' live and show the app loading.

Instructor checks: Did a real non-CS person complete Steps 1–5 unassisted? Is the Lighthouse score ≥ 80?

 

Sprint 5 Metrics
Metric

What to Measure

Target / Threshold

Usability Task Completion

Tasks T1–T7 completed by non-CS participant

≥ 5 of 7 tasks completed independently within time limits

SUS Score

System Usability Scale (10-question form)

≥ 68 (industry average)

Lighthouse Performance

Lighthouse audit on production build

≥ 80

Lighthouse Accessibility

Lighthouse accessibility audit

≥ 85

Docker Startup

docker-compose up timing

App fully loaded within 30 seconds

End-to-End Regression

Full Steps 1–7 with 3 different CSV files

Zero crashes across all 3 runs

Code Documentation

Functions with JSDoc / docstrings ÷ total functions

≥ 80% of functions documented

Full Domain Coverage

Test all 20 domains end-to-end (Steps 1–7)

All 20 domains complete the full pipeline without errors

