from deep_translator import GoogleTranslator

def test_translation():
    text = "How is my rice crop doing?"
    translated = GoogleTranslator(source='en', target='hi').translate(text)
    back_to_en = GoogleTranslator(source='hi', target='en').translate(translated)
    print(f"English: {text}")
    with open("translation_result.txt", "w", encoding="utf-8") as f:
        f.write(f"English: {text}\n")
        f.write(f"Hindi: {translated}\n")
        f.write(f"Back to English: {back_to_en}\n")
    print("Translation results saved to translation_result.txt")

if __name__ == "__main__":
    test_translation()
