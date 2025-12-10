"""Article categorization module"""
import re
import time
from google import genai


class Categorizer:
    """Handles article categorization using Google Generative AI"""
    
    CATEGORIES = ["Politics", "Sports", "Technology", "Business", "Entertainment", 
                  "Health", "Science", "World", "Local", "Other"]
    
    def __init__(self, api_key: str = None, max_retries: int = 2, initial_wait: int = 5):
        self.client = genai.Client(api_key=api_key) if api_key else genai.Client()
        self.max_retries = max_retries
        self.initial_wait = initial_wait
    
    def categorize(self, text: str) -> str:
        """Detect article category"""
        if not text or not text.strip():
            return "Other"
        
        for attempt in range(self.max_retries):
            try:
                categories = ", ".join(self.CATEGORIES)
                prompt = f"""Analyze this text and determine its main category.
Choose from: {categories}
Return ONLY the category name without additional text:

{text}"""
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                result = response.text.strip()
                result = re.sub(r'[^a-zA-Z\s]', '', result).strip()
                return result if result and result in self.CATEGORIES else "Other"
            except Exception as e:
                is_quota = "429" in str(e) or "quota" in str(e).lower()
                if attempt < self.max_retries - 1:
                    wait = self.initial_wait * (2 ** attempt)
                    print(f"   ⚠️ {'Quota' if is_quota else 'Category'} error. Waiting {wait}s...")
                    time.sleep(wait)
                else:
                    print(f"   ❌ Categorization failed after {self.max_retries} attempts")
                    return "Other"
        
        return "Other"
