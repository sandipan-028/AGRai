FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Train models on build (using synthetic data)
RUN python ml/train_crop.py
RUN python ml/train_disease.py

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
