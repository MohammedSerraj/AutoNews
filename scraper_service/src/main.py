"""Main news scraper and processor orchestrator"""
import os
import time
import sys
import argparse
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import Error

# Load environment variables
load_dotenv()

# Import custom modules
from scraper import Scraper
from ai import Translator, Categorizer


class RateLimiter:
    """Simple rate limiter"""
    def __init__(self, max_requests: int, time_window: int):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = []
    
    def wait(self):
        """Wait if rate limit is exceeded"""
        now = time.time()
        self.requests = [t for t in self.requests if now - t < self.time_window]
        
        if len(self.requests) >= self.max_requests:
            sleep = self.time_window - (now - self.requests[0])
            if sleep > 0:
                print(f"⏳ Rate limit. Waiting {sleep:.1f}s...")
                time.sleep(sleep)
        
        self.requests.append(time.time())


class NewsProcessor:
    """Main processor for fetching and processing news articles"""
    
    def __init__(self):
        self.db_config = {
            'host': os.getenv('DB_HOST'),
            'user': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASSWORD'),
            'database': os.getenv('DB_DATABASE')
        }
        self.sitemap_url = os.getenv('SITEMAP_URL')
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        self.images_dir = self._get_images_dir()
        self.conn = None
        self.rate_limiter = RateLimiter(
            int(os.getenv('RATE_LIMIT_REQUESTS', 2)),
            int(os.getenv('RATE_LIMIT_WINDOW', 60))
        )
        
        # Initialize AI modules
        self.scraper = Scraper(self.headers, self.images_dir)
        self.translator = Translator()
        self.categorizer = Categorizer()
    
    @staticmethod
    def _get_images_dir() -> str:
        """Get or create images directory in backend/public/static"""
        # Go up from scraper_service to AutoNews root, then into backend
        root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        img_dir = os.path.join(root, "backend", "public", "static", "articles_images")
        os.makedirs(img_dir, exist_ok=True)
        return img_dir
    
    def connect_db(self) -> bool:
        """Connect to database"""
        try:
            self.conn = mysql.connector.connect(**self.db_config)
            print("✅ Connected to MySQL")
            self._create_table()
            return True
        except Error as e:
            print(f"❌ DB Error: {e}")
            return False
    
    def _create_table(self):
        """Create articles table if not exists"""
        try:
            cursor = self.conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS articles (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title_ar TEXT,
                    title_en TEXT,
                    date VARCHAR(255),
                    content_ar TEXT,
                    content_en TEXT,
                    category VARCHAR(100),
                    image_url VARCHAR(500),
                    source_url VARCHAR(500) UNIQUE,
                    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            self.conn.commit()
            print("✅ Table verified")
        except Error as e:
            print(f"⚠️ Table error: {e}")
    
    def fetch_sitemap(self) -> list:
        """Fetch URLs from sitemap"""
        try:
            r = requests.get(self.sitemap_url, headers=self.headers, 
                           timeout=int(os.getenv('TIMEOUT', 20)))
            soup = BeautifulSoup(r.text, 'lxml-xml')
            urls = [loc.text.strip() for loc in soup.find_all('loc')]
            print(f"📊 Found {len(urls)} URLs")
            return urls
        except Exception as e:
            print(f"❌ Sitemap Error: {e}")
            return []
    
    def insert_article(self, data: tuple) -> bool:
        """Insert/update article in database"""
        query = """
            INSERT INTO articles (title_ar, title_en, date, content_ar, content_en, 
                                 category, image_url, source_url, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                title_en=VALUES(title_en), content_en=VALUES(content_en),
                category=VALUES(category), image_url=VALUES(image_url),
                status=VALUES(status)
        """
        try:
            cursor = self.conn.cursor()
            cursor.execute(query, data)
            self.conn.commit()
            return True
        except Error as e:
            print(f"❌ Insert Error: {e}")
            return False
    
    def get_image(self, soup, url: str, category: str, title: str) -> str:
        """Get and download image for article"""
        try:
            images = self.scraper.extract_images(soup, url)
            for img_url in images:
                if self.scraper.validate_image(img_url):
                    filename = self.scraper.download_image(img_url, title, category)
                    if filename:
                        return filename
        except:
            pass
        return None
    
    def process_article(self, url: str) -> bool:
        """Process single article"""
        try:
            print(f"📰 {url}")
            r = requests.get(url, headers=self.headers, 
                           timeout=int(os.getenv('TIMEOUT', 20)))
            soup = BeautifulSoup(r.text, 'lxml')
            
            title = self.scraper.extract_title(soup) or "No Title"
            date = self.scraper.extract_date(soup)
            content = self.scraper.extract_content(soup)
            
            if not content:
                print("   ⏭️ Empty content, skipping")
                return False
            
            # Translate
            self.rate_limiter.wait()
            title_en = self.translator.translate(title)
            
            self.rate_limiter.wait()
            content_en = self.translator.translate(content)
            
            # Skip if translation failed
            if not title_en or not content_en:
                print("   ❌ Translation failed, skipping")
                return False
            
            # Categorize
            self.rate_limiter.wait()
            category = self.categorizer.categorize(content)
            print(f"   📂 {category}")
            
            # Get image
            image = self.get_image(soup, url, category, title)
            if image:
                print(f"   ✅ Image: {image}")
            
            # Save completed article only
            self.insert_article((title, title_en, date, content, content_en, 
                               category, image, url, "completed"))
            
            print(f"   ✅ COMPLETED")
            return True
        except Exception as e:
            print(f"   ❌ Error: {e}")
            return False
    
    def run(self, limit: int = 0, reset: bool = False):
        """Main execution"""
        print("🚀 Starting News Processor")
        
        if not self.connect_db():
            return
        
        urls = self.fetch_sitemap()
        if not urls:
            return
        
        if limit > 0:
            urls = urls[:limit]
        
        processed = 0
        for i, url in enumerate(urls, 1):
            print(f"\n[{i}/{len(urls)}]", end=" ")
            if self.process_article(url):
                processed += 1
            time.sleep(1)
        
        if self.conn:
            self.conn.close()
        
        print(f"\n✅ Complete: {processed}/{len(urls)} articles processed")
    
    def cleanup(self):
        """Cleanup resources"""
        if self.conn:
            self.conn.close()


def main():
    parser = argparse.ArgumentParser(description='News Scraper')
    parser.add_argument('--limit', type=int, default=0, help='Limit articles to process')
    parser.add_argument('--reset', action='store_true', help='Reset all translations')
    args = parser.parse_args()
    
    processor = NewsProcessor()
    try:
        processor.run(limit=args.limit, reset=args.reset)
    finally:
        processor.cleanup()


if __name__ == "__main__":
    main()
