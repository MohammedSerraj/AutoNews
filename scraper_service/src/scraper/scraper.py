"""Web scraper module for extracting article data"""
import re
import os
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse


class Scraper:
    """Handles web scraping operations"""
    
    def __init__(self, headers: dict, images_dir: str):
        self.headers = headers
        self.images_dir = images_dir
        os.makedirs(images_dir, exist_ok=True)
    
    @staticmethod
    def clean_text(s: str) -> str:
        """Clean and normalize text"""
        if not s:
            return ""
        s = re.sub(r'\s+', ' ', s).strip()
        s = re.sub(r'\bإعلان\b$', '', s).strip()
        return s
    
    def extract_title(self, soup: BeautifulSoup) -> str:
        """Extract article title from HTML"""
        selectors = [
            ("h1", {"class": "entry-title"}),
            ("h1", {}),
            ("h2", {"class": "entry-title"}),
            ("h1", {"class": "post-title"}),
            ("h1", {"class": "article-title"}),
            ("header h1", {}),
        ]
        for tag, attrs in selectors:
            el = soup.find(tag, attrs=attrs)
            if el and el.text.strip():
                return self.clean_text(el.get_text(separator=" ", strip=True))
        
        # Try meta tags
        for prop in ["og:title", "title"]:
            og = soup.find("meta", property=prop)
            if og and og.get("content"):
                return self.clean_text(og["content"])
        
        t = soup.find("title")
        return self.clean_text(t.text) if t and t.text.strip() else ""
    
    def extract_date(self, soup: BeautifulSoup) -> str:
        """Extract article date from HTML"""
        t = soup.find("time")
        if t:
            return self.clean_text(t.get("datetime") or t.text)
        
        for prop in ["article:published_time", "date"]:
            meta = soup.find("meta", property=prop)
            if meta and meta.get("content"):
                return self.clean_text(meta["content"])
        
        return ""
    
    def extract_content(self, soup: BeautifulSoup) -> str:
        """Extract article content from HTML"""
        selectors = [
            ("div", {"class": "entry-content"}),
            ("div", {"class": "post-content"}),
            ("div", {"class": "content"}),
            ("article", {}),
            ("div", {"itemprop": "articleBody"}),
        ]
        for tag, attrs in selectors:
            el = soup.find(tag, attrs=attrs)
            if el:
                text = el.get_text(separator="\n", strip=True)
                return self.clean_text(text)
        
        ps = soup.find_all("p")
        if ps:
            return self.clean_text("\n".join(p.get_text(strip=True) for p in ps))
        
        return ""
    
    def extract_images(self, soup: BeautifulSoup, base_url: str) -> list:
        """Extract all image URLs from the article"""
        images = []
        selectors = [
            'img.entry-thumbnail', 'img.wp-post-image', 'img.attachment-full',
            'img.size-full', '.entry-content img', '.post-content img',
            '.article-content img', '.news-content img', 'figure img',
            'img[src*="wp-content"]', 'img[src*="uploads"]'
        ]
        
        for selector in selectors:
            for img in soup.select(selector):
                src = img.get('src')
                if src:
                    src = self._normalize_url(src, base_url)
                    width, height = img.get('width'), img.get('height')
                    if not (width and height and int(width) < 300 and int(height) < 200):
                        images.append(src)
        
        # Check meta tags
        for selector in ['meta[property="og:image"]', 'meta[name="twitter:image"]']:
            meta = soup.select_one(selector)
            if meta:
                content = meta.get('content') or meta.get('href')
                if content:
                    images.append(self._normalize_url(content, base_url))
        
        # Remove duplicates while preserving order
        return list(dict.fromkeys(images))
    
    @staticmethod
    def _normalize_url(url: str, base_url: str) -> str:
        """Convert relative URLs to absolute"""
        if url.startswith('//'):
            return 'https:' + url
        elif url.startswith('/'):
            return urljoin(base_url, url)
        elif not url.startswith('http'):
            return urljoin(base_url, url)
        return url
    
    def validate_image(self, url: str) -> bool:
        """Check if image URL is accessible"""
        try:
            r = requests.head(url, headers=self.headers, timeout=10)
            return r.status_code == 200 and 'image' in r.headers.get('content-type', '')
        except:
            return False
    
    def download_image(self, img_url: str, title: str, category: str) -> str:
        """Download and save image locally"""
        try:
            r = requests.get(img_url, headers=self.headers, timeout=15)
            if r.status_code != 200 or 'image' not in r.headers.get('content-type', ''):
                return None
            
            # Get file extension
            ext = self._get_extension(img_url)
            safe_title = re.sub(r'[^a-zA-Z0-9]', '_', title[:50]) if title else "article"
            safe_cat = re.sub(r'[^a-zA-Z0-9]', '_', category or "general")
            filename = f"{safe_cat}_{safe_title}_{int(time.time())}{ext}"
            filepath = os.path.join(self.images_dir, filename)
            
            with open(filepath, 'wb') as f:
                f.write(r.content)
            
            # Validate file size
            if os.path.getsize(filepath) < 1000:
                os.remove(filepath)
                return None
            
            return filename
        except:
            return None
    
    @staticmethod
    def _get_extension(url: str) -> str:
        """Extract file extension from URL"""
        path = urlparse(url).path.lower()
        for ext in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
            if ext in path:
                return ext
        return '.jpg'
