import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
import pickle
import os

os.makedirs("backend/ml", exist_ok=True)

def train_yield_model():
    # Attempt to load the real Indian Crops Kaggle dataset if the user has downloaded it
    csv_path = "backend/ml/indian_crops.csv"
    try:
        print(f"Attempting to load real data from {csv_path}...")
        df = pd.read_csv(csv_path)
    except Exception as e:
        print(f"Error fetching data: {e}. Falling back to synthetic Indian Crops dataset.")
        # Synthetic dataset representing rohitashvakumawat/indian-crops
        states = ['Maharashtra', 'Punjab', 'Uttar Pradesh', 'Andhra Pradesh']
        crops = ['Wheat', 'Rice', 'Sugarcane', 'Cotton']
        seasons = ['Kharif', 'Rabi', 'Whole Year']
        
        n_samples = 1000
        data = {
            'State': np.random.choice(states, n_samples),
            'Crop': np.random.choice(crops, n_samples),
            'Season': np.random.choice(seasons, n_samples),
            'Area': np.random.uniform(100, 10000, n_samples), # Hectares
            'Annual_Rainfall': np.random.uniform(300, 3000, n_samples), # mm
            'Fertilizer': np.random.uniform(500, 50000, n_samples), # kg
            'Pesticide': np.random.uniform(10, 1000, n_samples), # kg
            'Yield': np.random.uniform(1, 10, n_samples) # Tons per hectare
        }
        df = pd.DataFrame(data)

    # Preprocessing
    # Encode categorical variables
    le_state = LabelEncoder()
    le_crop = LabelEncoder()
    le_season = LabelEncoder()
    
    df['State'] = le_state.fit_transform(df['State'])
    df['Crop'] = le_crop.fit_transform(df['Crop'])
    df['Season'] = le_season.fit_transform(df['Season'])
    
    # We want to predict Yield
    # Drop Production if it exists because Yield = Production / Area
    if 'Production' in df.columns:
        df = df.drop('Production', axis=1)
    if 'Crop_Year' in df.columns:
        df = df.drop('Crop_Year', axis=1) # Year might not be useful for future prediction

    X = df.drop('Yield', axis=1)
    y = df['Yield']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    
    # Use XGBRegressor for predicting a continuous value (Yield)
    model = xgb.XGBRegressor(eval_metric='rmse')
    model.fit(X_train_scaled, y_train)
    
    # Save model, scaler, and label encoders
    model_path = "backend/ml/yield_model.pkl"
    scaler_path = "backend/ml/yield_scaler.pkl"
    encoders_path = "backend/ml/yield_encoders.pkl"
    
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    with open(scaler_path, 'wb') as f:
        pickle.dump(scaler, f)
        
    with open(encoders_path, 'wb') as f:
        pickle.dump({
            'state': le_state,
            'crop': le_crop,
            'season': le_season
        }, f)
    
    print(f"Yield prediction model trained and saved to {model_path}")

if __name__ == "__main__":
    train_yield_model()
