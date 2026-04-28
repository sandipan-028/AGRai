import os
import subprocess
import sys

def train_all():
    print("Starting Comprehensive Model Training from Kaggle Data...")
    
    # 1. Train Crop Recommendation Model
    print("\n--- Phase 1: Crop Recommendation Model ---")
    try:
        from train_crop import train_crop_model
        train_crop_model()
    except Exception as e:
        print(f"Crop model training failed: {e}")

    # 2. Train Disease Detection Model
    print("\n--- Phase 2: Disease Detection Model ---")
    try:
        from train_disease import train_disease_model
        train_disease_model()
    except Exception as e:
        print(f"Disease model training failed: {e}")

    # 3. Train Yield Prediction Model
    print("\n--- Phase 3: Yield Prediction Model ---")
    try:
        from train_yield import train_yield_model
        train_yield_model()
    except Exception as e:
        print(f"Yield model training failed: {e}")

    print("\nTraining Complete! All models are at their 'best' configuration.")

if __name__ == "__main__":
    train_all()
