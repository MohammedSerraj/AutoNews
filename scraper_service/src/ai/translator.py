"""Text translation module"""
import time
from google import genai


class Translator:
    """Handles text translation using Google Generative AI"""
    
    def __init__(self, api_key: str = None, max_retries: int = 3, initial_wait: int = 5):
        self.client = genai.Client(api_key=api_key) if api_key else genai.Client()
        self.max_retries = max_retries
        self.initial_wait = initial_wait
    
    def translate(self, text: str) -> str:
        """Translate Arabic text to English"""
        if not text or not text.strip():
            return ""
        
        for attempt in range(self.max_retries):
            try:
                prompt = f"""Translate this Arabic text to English accurately and professionally. 
Return ONLY the translation without additional text:

{text}"""
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                result = response.text.strip()
                # Clean markdown
                for char in ['*', '`', '"', '**']:
                    result = result.replace(char, '')
                return result
            except Exception as e:
                is_quota = "429" in str(e) or "quota" in str(e).lower()
                if attempt < self.max_retries - 1:
                    wait = self.initial_wait * (2 ** attempt)
                    print(f"   ⚠️ {'Quota' if is_quota else 'Translation'} error. Waiting {wait}s...")
                    time.sleep(wait)
                else:
                    print(f"   ❌ Translation failed after {self.max_retries} attempts")
                    return ""
        
        return ""
