from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from database.session import get_db
from schemas.schemas import CropPredictInput, FullAnalysisOutput, YieldPredictInput, YieldPredictOutput
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
    # Real disease detection logic using the advanced model
    model_path = "backend/ml/disease_model.h5"
    classes_path = "backend/ml/disease_classes.pkl"
    
    if os.path.exists(model_path) and os.path.exists(classes_path):
        import tensorflow as tf
        import pickle
        from PIL import Image
        import io
        
        # Load model and classes
        model = tf.keras.models.load_model(model_path)
        with open(classes_path, 'rb') as f:
            classes = pickle.load(f)
            
        # Process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).resize((128, 128))
        img_array = tf.keras.preprocessing.image.img_to_array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Predict
        predictions = model.predict(img_array)
        class_idx = np.argmax(predictions[0])
        disease = classes[class_idx]
        confidence = float(np.max(predictions[0]))
        
        return {
            "disease": disease,
            "confidence": f"{confidence*100:.2f}%",
            "treatment": get_treatment_suggestion(disease)
        }
    
    return {
        "disease": "Leaf Spot (Mock)",
        "severity": "Moderate",
        "treatment": "Apply organic neem oil and improve air circulation."
    }

def get_treatment_suggestion(disease):
    suggestions = {
        "Healthy": "Keep doing what you're doing! Maintain regular monitoring.",
        "Powdery Mildew": "Use organic sulfur or neem oil. Improve air circulation.",
        "Rust": "Remove infected leaves. Apply copper-based organic fungicides.",
        "Leaf Spot": "Prune infected areas. Avoid overhead watering.",
        "Blight": "Apply organic fungicides. Remove severely infected plants.",
        "Mosaic Virus": "Control aphids (vectors). Remove infected plants immediately.",
        "Downy Mildew": "Improve drainage. Use organic potassium bicarbonate spray.",
        "Canker": "Prune during dry weather. Sterilize tools after use.",
        "Anthracnose": "Apply organic neem oil. Rotate crops.",
        "Scab": "Rake up fallen leaves. Use organic lime sulfur spray."
    }
    return suggestions.get(disease, "Consult a local agricultural expert for organic treatments.")

@router.post("/full-analysis", response_model=FullAnalysisOutput)
async def full_analysis(data: CropPredictInput):
    # Integration with Ollama for unified response
    ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434") + "/api/generate"
    
    prompt = f"""
    Act as an elite Multilingual Agricultural Scientist and Consultant. 
    Analyze these specific field conditions:
    - Location: Lat {data.lat}, Lon {data.lon} (Contextualize for this region)
    - Soil Nutrients: Nitrogen={data.n}, Phosphorus={data.p}, Potassium={data.k}
    - Environment: Temperature={data.temperature}°C, Humidity={data.humidity}%, Soil pH={data.ph}, Rainfall={data.rainfall}mm.
    
    Based on the 'Crop Recommendation Dataset' insights:
    1. Recommend the 3 most profitable and sustainable crops.
    2. Identify the most likely disease for the primary recommendation.
    3. Provide a detailed Organic Integrated Pest Management (IPM) solution.
    4. Create a 3-step precision farming care plan for the next 3 months.
    
    Return the response ONLY as a JSON object with these EXACT keys:
    "crop_recommendation" (list of strings), 
    "disease" (string), 
    "organic_solution" (string), 
    "care_plan" (list of strings), 
    "confidence" (string percentage).
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

def load_yield_model():
    m_path = "backend/ml/yield_model.pkl"
    s_path = "backend/ml/yield_scaler.pkl"
    e_path = "backend/ml/yield_encoders.pkl"
    if os.path.exists(m_path) and os.path.exists(s_path) and os.path.exists(e_path):
        with open(m_path, 'rb') as f: model = pickle.load(f)
        with open(s_path, 'rb') as f: scaler = pickle.load(f)
        with open(e_path, 'rb') as f: encoders = pickle.load(f)
        return model, scaler, encoders
    return None, None, None

@router.post("/yield", response_model=YieldPredictOutput)
async def predict_yield(data: YieldPredictInput):
    model, scaler, encoders = load_yield_model()
    if not model:
        # Fallback/Mock
        return {"predicted_yield": 4.5, "unit": "Tons per Hectare (Mock)"}
    
    try:
        le_state = encoders['state']
        le_crop = encoders['crop']
        le_season = encoders['season']
        
        # Handle unseen labels gracefully by assigning a default or 0 (or raising error)
        state_encoded = le_state.transform([data.state])[0] if data.state in le_state.classes_ else 0
        crop_encoded = le_crop.transform([data.crop])[0] if data.crop in le_crop.classes_ else 0
        season_encoded = le_season.transform([data.season])[0] if data.season in le_season.classes_ else 0
        
        features = np.array([[
            state_encoded,
            crop_encoded,
            season_encoded,
            data.area,
            data.annual_rainfall,
            data.fertilizer,
            data.pesticide
        ]])
        
        scaled_features = scaler.transform(features)
        prediction = model.predict(scaled_features)
        
        # Prevent negative yields
        final_yield = max(0.0, float(prediction[0]))
        
        return {"predicted_yield": round(final_yield, 2), "unit": "Tons per Hectare"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")
