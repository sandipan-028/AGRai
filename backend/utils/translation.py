from deep_translator import GoogleTranslator

class TranslationService:
    @staticmethod
    def translate_to_english(text, source_lang='auto'):
        try:
            return GoogleTranslator(source=source_lang, target='en').translate(text)
        except Exception as e:
            print(f"Translation Error: {e}")
            return text

    @staticmethod
    def translate_from_english(text, target_lang='hi'):
        try:
            # Map common language names to codes if needed
            lang_map = {
                'Hindi': 'hi',
                'Kannada': 'kn',
                'Tamil': 'ta',
                'Bengali': 'bn',
                'English': 'en'
            }
            lang_code = lang_map.get(target_lang, target_lang)
            return GoogleTranslator(source='en', target=lang_code).translate(text)
        except Exception as e:
            print(f"Translation Error: {e}")
            return text

translator = TranslationService()
