import os
from dotenv import load_dotenv
from google import genai
import time

load_dotenv()

class RateLimiter:
    """
    Sliding window rate limiter to manage per-minute and per-day API limits.
    
    This ensures that we don't exceed the free tier limits of the Gemini API.
    """
    def __init__(self, max_rpm: int, max_rpd: int):
        self.max_rpm = max_rpm       # requests per minute limit
        self.max_rpd = max_rpd       # requests per day limit
        self.minute_requests = []    # list of timestamps for requests within the current minute
        self.day_requests = []       # list of timestamps for requests within the current day

    def wait(self):
        """
        Pauses execution if the per-minute limit is reached,
        and raises an exception if the daily limit is exceeded.
        """
        now = time.time()

        # Clean old requests
        self.minute_requests = [t for t in self.minute_requests if now - t < 60]
        self.day_requests = [t for t in self.day_requests if now - t < 86400]

        # Check daily limit
        if len(self.day_requests) >= self.max_rpd:
            raise Exception("⚠️ Daily limit reached. Wait until tomorrow.")

        # Check per-minute limit
        if len(self.minute_requests) >= self.max_rpm:
            sleep_time = 60 - (now - self.minute_requests[0])
            if sleep_time > 0:
                print(f"⏳ Minute limit reached. Sleeping {sleep_time:.1f}s...")
                time.sleep(sleep_time)
            # After sleeping, clean again
            now = time.time()
            self.minute_requests = [t for t in self.minute_requests if now - t < 60]

        # Record request
        self.minute_requests.append(time.time())
        self.day_requests.append(time.time())

api_key = os.getenv("GEMINI_API_KEY")
limiter = RateLimiter(max_rpm=15, max_rpd=900)  # Free Tier safe limits to avoid blocking
client = genai.Client(api_key=api_key)

def translate_to_english(text):
    """
    Translates Arabic text to English using the Gemini API.
    
    Args:
        text (str): The Arabic text to translate.
        
    Returns:
        str or None: The English translation, or None if the request fails.
    """
    if not text:
        return ""
    limiter.wait()
    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite-preview",
            contents=f"Translate the following text to English nicely without adding any conversational fillers, just provide the translation in English (no prefix or suffix):\n\n{text}"
        )
        return response.text.strip()
    except Exception as e:
        print(f"Translation error: {e}")
        return None

def detect_category(text):
    """
    Categorizes the provided text into one of a predefined set of news categories.
    
    Args:
        text (str): The content to analyze.
        
    Returns:
        str: The name of the detected category.
    """
    if not text:
        return "Local"
    limiter.wait()
    try:
        categories = [
            "Technology", "Politics", "Crime", "Business", 
            "Science", "Health", "Sports", "Entertainment", 
            "World", "Local", "Celebrities", "Weather",
            "Education", "Real Estate"
        ]
        cat_list = ", ".join(categories)
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite-preview",
            contents=f"Read the following text and categorize it STRICTLY into exactly ONE of the following categories: {cat_list}. Return ONLY the exact category name and absolutely nothing else:\n\n{text}"
        )
        cat = response.text.strip()
        
        # Verify it's in the allowed list (case-insensitive search)
        for valid_cat in categories:
            if valid_cat.lower() in cat.lower():
                return valid_cat
                
        return "Local" # fallback default category
    except Exception as e:
        print(f"Category detection error: {e}")
        return "Local"