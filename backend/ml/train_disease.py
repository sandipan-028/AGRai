import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np
import os
import pickle

def train_disease_model():
    # Simple CNN architecture
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(128, 128, 3)),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dense(10, activation='softmax') # Assuming 10 disease classes
    ])
    
    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])
    
    # Save the model
    model_path = "backend/ml/disease_model.h5"
    model.save(model_path)
    
    # Dummy classes
    classes = ['Healthy', 'Powdery Mildew', 'Rust', 'Leaf Spot', 'Blight', 'Mosaic Virus', 'Downy Mildew', 'Canker', 'Anthracnose', 'Scab']
    classes_path = "backend/ml/disease_classes.pkl"
    with open(classes_path, 'wb') as f:
        pickle.dump(classes, f)
    
    print(f"Disease model saved to {model_path}")

if __name__ == "__main__":
    train_disease_model()
