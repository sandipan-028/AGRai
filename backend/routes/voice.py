from fastapi import APIRouter, UploadFile, File, HTTPException, Body
import os
import aiohttp
import json
from utils.translation import translator

router = APIRouter()

@router.post("/process")
async def process_voice(file: UploadFile = File(...), target_lang: str = "English"):
    # Pipeline:
    # 1. Save file locally (Mocked for now)
    # 2. Whisper (STT) -> text (Mocked for now)
    input_text = "How is my rice crop doing?" # This would come from STT
    
    return await process_text_query(input_text, target_lang)

@router.post("/process-text")
async def process_text(data: dict = Body(...)):
    text = data.get("text")
    target_lang = data.get("target_lang", "English")
    
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")
        
    return await process_text_query(text, target_lang)

async def process_text_query(text: str, target_lang: str):
    try:
        # 3. Translate to English
        english_text = translator.translate_to_english(text)
        
        # 4. AI Assistant Process (Calling Ollama)
        ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434") + "/api/generate"
        prompt = f"As an agriculture expert, answer this: {english_text}"
        
        ai_response_en = "Your crop looks healthy. Ensure proper irrigation." # Default
        
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "model": "llama3",
                    "prompt": prompt,
                    "stream": False
                }
                async with session.post(ollama_url, json=payload) as resp:
                    if resp.status == 200:
                        result = await resp.json()
                        ai_response_en = result.get('response', ai_response_en)
        except Exception as e:
            print(f"Ollama Error: {e}")

        # 5. Translate back to target language
        final_response = translator.translate_from_english(ai_response_en, target_lang)
        
        return {
            "input_text": text,
            "english_text": english_text,
            "ai_response": final_response,
            "detected_language": target_lang
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/languages")
async def get_supported_languages():
    return ["Hindi", "Kannada", "Tamil", "English", "Bengali"]
