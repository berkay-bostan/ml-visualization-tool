# Setup Guide

## Prerequisites
- Node.js 18+
- Python 3.10+
- pip

---

## Frontend Setup

cd frontend  
npm install  
npm run dev  

Frontend runs at:
http://localhost:5173

---

## Backend Setup

cd backend  
pip install -r requirements.txt  
uvicorn main:app --reload  

Backend API docs:
http://localhost:8000/docs

---

## Notes
Make sure both frontend and backend are running simultaneously during development.
