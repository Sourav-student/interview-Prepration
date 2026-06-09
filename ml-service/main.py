from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import os

app = FastAPI()

# Frontend URLs
origins = [
    "http://localhost:3000",
    "https://interview-preparation-beta.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model = joblib.load("placement_model.pkl")


class Student(BaseModel):
    cgpa: float
    internships: int
    projects: int
    certifications: int
    aptitude: float
    softskills: float
    extracurricular: int
    placement_training: int


@app.get("/")
def home():
    return {"message": "Placement Prediction API Running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/predict")
def predict(student: Student):
    features = [[
        student.cgpa,
        student.internships,
        student.projects,
        student.certifications,
        student.aptitude,
        student.softskills,
        student.extracurricular,
        student.placement_training
    ]]

    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0]

    return {
        "prediction": int(prediction),
        "probability": float(probability[1])
    }