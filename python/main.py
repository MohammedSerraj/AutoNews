import urllib.request
import os
import time
from dotenv import load_dotenv
from imagekitio import ImageKit
from apscheduler.schedulers.blocking import BlockingScheduler
from datetime import datetime

from scraper import get_article_links, scrape_article
from translator import translate_to_english, detect_category
from db import insert_article, article_exists

load_dotenv()

imagekit_client = ImageKit(private_key=os.getenv("IMAGEKIT_PRIVATE_KEY"))

def upload_image_to_imagekit(image_url):
    """
    Downloads an image from a URL and uploads it to ImageKit.
    
    Args:
        image_url (str): The source URL of the image.
        
    Returns:
        str: The URL of the uploaded image on ImageKit, or the original URL on failure.
    """
    if not image_url:
        return ""
    
    # Security: SSRF Protection. Only allow http/https schemes.
    if not image_url.startswith(("http://", "https://")):
        print(f"Skipping potentially unsafe image URL: {image_url}")
        return ""

    try:
        # Using a custom User-Agent to avoid being blocked by servers
        req = urllib.request.Request(
            image_url, 
            data=None, 
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            image_data = response.read()
        
        # Extract filename from URL
        file_name = image_url.split("/")[-1]
        if not file_name or "?" in file_name:
            file_name = "downloaded_image.jpg"
            
        print(f"Uploading image {file_name} to ImageKit...")
        response = imagekit_client.files.upload(
            file=image_data,
            file_name=file_name
        )
        return response.url
    except Exception as e:
        print(f"Image upload error: {e}")
        return image_url

def process_news():
    """
    Orchestrates the news scraping, translation, and database insertion process.
    """
    print(f"\n--- Job Started at {time.strftime('%Y-%m-%d %H:%M:%S')} ---")
    print("Fetching article links...")
    links = get_article_links()
    print(f"Found {len(links)} links.")

    for link in links:
        # Check if we already have this article to avoid duplicates
        if article_exists(link):
            print(f"Skipping already existing article: {link}")
            continue

        print(f"\nProcessing: {link}")
        data = scrape_article(link)

        if not data:
            print("Failed to scrape. Skipping.")
            continue
            
        # Basic validation to ensure we have content to translate
        if not data.get("title") or not data.get("content"):
            print("Missing essential data (title or content). Skipping.")
            continue

        print("Scraping successful. Translating Title and Content...")
        english_title = translate_to_english(data["title"])
        english_content = translate_to_english(data["content"])

        if english_title is None or english_content is None:
            print("Translation failed. Skipping database insertion.")
            continue

        print("Detecting Category...")
        category = detect_category(english_content)

        print("Handling Image (Download & Upload)...")
        new_image_url = upload_image_to_imagekit(data["image"])

        print("Saving to database...")
        insert_article(
            url=data["url"],
            title=english_title,
            content=english_content,
            image=new_image_url,
            category=category
        )
    print(f"--- Job Finished at {time.strftime('%Y-%m-%d %H:%M:%S')} ---")

if __name__ == "__main__":
    # Create a scheduler to run the process every 24 hours
    scheduler = BlockingScheduler()
    
    # Add the job to run every 24 hours
    scheduler.add_job(process_news, 'interval', hours=24, next_run_time=datetime.now())
    
    print("Scheduler started. Running news process every 24 hours...")
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        pass
