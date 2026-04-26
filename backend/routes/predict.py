from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from database.session import get_db
from schemas.schemas import CropPredictInput, FullAnalysisOutput
import pickle
import numpy as np
import os
import aiohttp
import json

router = APIRouter()

# Load models
MODEL_PATH = "backend/ml/crop_model.pkl"
LE_PATH = "backend/ml/crop_le.pkl"

def load_crop_model():
    if os.path.exists(MODEL_PATH) and os.path.exists(LE_PATH):
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        with open(LE_PATH, 'rb') as f:
            le = pickle.load(f)
        return model, le
    return None, None

@router.post("/crop")
async def predict_crop(data: CropPredictInput):
    model, le = load_crop_model()
    if not model:
        # Fallback/Mock if model not trained
        return {"recommendations": ["Rice", "Maize", "Wheat"], "confidence": "Mock"}
    
    input_features = np.array([[data.n, data.p, data.k, data.temperature, data.humidity, data.ph, data.rainfall]])
    prediction = model.predict_proba(input_features)
    top_indices = np.argsort(prediction[0])[-3:][::-1]
    crops = le.inverse_transform(top_indices)
    
    return {"recommendations": crops.tolist(), "confidence": f"{np.max(prediction[0])*100:.2f}%"}

@router.post("/disease")
async def predict_disease(file: UploadFile = File(...)):
    # Mock disease detection logic
    # In a real app, we would use the .h5 model
    return {
        "disease": "Leaf Spot",
        "severity": "Moderate",
        "treatment": "Apply organic neem oil and improve air circulation."
    }

@router.post("/full-analysis", response_model=FullAnalysisOutput)
async def full_analysis(data: CropPredictInput):
    # Integration with Ollama for unified response
    ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434") + "/api/generate"
    
    prompt = f"""
    Act as a senior agriculture expert. 
    Analyze the following conditions:
    Location: Lat {data.lat}, Lon {data.lon}
    Soil NPK: {data.n}, {data.p}, {data.k}
    Environment: Temp {data.temperature}C, Humidity {data.humidity}%, pH {data.ph}, Rainfall {data.rainfall}mm.
    
    Recommend the best 3 crops. 
    Suggest a potential disease to watch out for.
    Provide an organic solution for that disease.
    Create a 3-step future care plan.
    
    Return the response ONLY as a JSON object with keys:
    "crop_recommendation" (list), "disease" (string), "organic_solution" (string), "care_plan" (list), "confidence" (string).
    """
    
    try:
        async with aiohttp.ClientSession() as session:
            payload = {
                "model": "llama3",
                "prompt": prompt,
                "stream": False,
                "format": "json"
            }
            async with session.post(ollama_url, json=payload) as resp:
                if resp.status == 200:
                    result = await resp.json()
                    return json.loads(result['response'])
    except Exception as e:
        # Fallback response
        return {
            "crop_recommendation": ["Rice", "Sugarcane"],
            "disease": "Blight (Predicted)",
            "organic_solution": "Use copper-based organic fungicides.",
            "care_plan": ["Monitor soil moisture", "Apply organic mulch", "Rotate crops"],
            "confidence": "85% (Fallback)"
        }
