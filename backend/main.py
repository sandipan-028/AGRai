from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, predict, voice
from database import session
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AgriAI API", version="1.0.0")

import os

# CORS Configuration
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://localhost:5174,http://localhost:5175,http://localhost:5176").split(",")


app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up AgriAI Backend...")
    # Initialize database tables if needed
    session.init_db()

@app.get("/")
async def root():
    return {"message": "Welcome to AgriAI API"}

# Include routes
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(predict.router, prefix="/predict", tags=["Predictions"])
app.include_router(voice.router, prefix="/voice", tags=["Voice"])
