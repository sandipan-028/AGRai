import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pickle
import os

# Create ml directory if it doesn't exist
os.makedirs("backend/ml", exist_ok=True)

def train_crop_model():
    # Real dataset for Indian conditions from user specified GitHub repository
    zip_url = "https://raw.githubusercontent.com/sujitha963/Crop-And-Soil-Recommendation-System/main/archive.zip"
    zip_path = "backend/ml/archive.zip"
    csv_path = "backend/ml/Crop_recommendation.csv"
    
    try:
        if not os.path.exists(csv_path):
            import urllib.request
            import zipfile
            print(f"Downloading dataset from {zip_url}...")
            urllib.request.urlretrieve(zip_url, zip_path)
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall("backend/ml/")
            os.remove(zip_path) # Clean up zip
            
        print(f"Loading data from {csv_path}...")
        df = pd.read_csv(csv_path)
    except Exception as e:
        print(f"Error fetching data: {e}. Falling back to synthetic.")
        data = {
            'N': np.random.randint(0, 100, 1000),
            'P': np.random.randint(0, 100, 1000),
            'K': np.random.randint(0, 100, 1000),
            'temperature': np.random.uniform(15, 45, 1000),
            'humidity': np.random.uniform(30, 90, 1000),
            'ph': np.random.uniform(5, 8, 1000),
            'rainfall': np.random.uniform(50, 300, 1000),
            'label': np.random.choice(['rice', 'maize', 'chickpea'], 1000)
        }
        df = pd.DataFrame(data)
    
    le = LabelEncoder()
    df['label'] = le.fit_transform(df['label'])
    
    X = df.drop('label', axis=1)
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = xgb.XGBClassifier(use_label_encoder=False, eval_metric='mlogloss')
    model.fit(X_train, y_train)
    
    # Save model and label encoder
    model_path = "backend/ml/crop_model.pkl"
    le_path = "backend/ml/crop_le.pkl"
    
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    with open(le_path, 'wb') as f:
        pickle.dump(le, f)
    
    print(f"Crop model trained and saved to {model_path}")

if __name__ == "__main__":
    train_crop_model()
