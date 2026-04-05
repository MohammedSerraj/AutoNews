import requests
from bs4 import BeautifulSoup

def get_article_links():
    """
    Fetches the news sitemap and extracts all article URLs.
    
    Returns:
        list: A list of URL strings found in the sitemap.
    """
    url = "https://tanjanews.com/news-sitemap.xml"
    # Security: Added timeout to prevent the script from hanging indefinitely
    page = requests.get(url, timeout=10)

    soup = BeautifulSoup(page.content, "xml")

    links = []
    # The sitemap usually contains <loc> tags with the article URLs
    for loc in soup.find_all("loc"):
        links.append(loc.text)

    return links

def scrape_article(url):
    """
    Scrapes a single article page for its title, content, and thumbnail image.
    
    Args:
        url (str): The URL of the article to scrape.
        
    Returns:
        dict or None: A dictionary containing 'url', 'title', 'content', and 'image',
                      or None if the article structure is not found.
    """
    # Security: Added timeout to prevent hanging on slow responses
    page = requests.get(url, timeout=10)
    soup = BeautifulSoup(page.content, "lxml")

    article = soup.find("article")
    if not article:
        return None
  
    # Find specific elements based on the website's CSS classes
    title = article.find("span", {"class": "post-title"})
    content = article.find("div", {"class": "single-post-content"})
    image = article.find("a", {"class": "post-thumbnail"})

    return {
        "url": url,
        "title": title.text.strip() if title else "",
        "content": content.text.strip() if content else "",
        "image": image.get("href", "") if image else ""
    }