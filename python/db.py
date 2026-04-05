import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    """
    Establishes and returns a connection to the MySQL database.
    
    The connection details are retrieved from environment variables:
    DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME.
    """
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

def insert_article(url, title, content, image, category):
    """
    Inserts a new article into the 'articles' table.
    
    Args:
        url (str): The original URL of the article.
        title (str): The translated title of the article.
        content (str): The translated content/body of the article.
        image (str): The ImageKit URL for the article's thumbnail.
        category (str): The detected category of the article.
    """
    conn = get_connection()
    cursor = conn.cursor()
    try:
        query = """
        INSERT INTO articles (url, title, content, image, category)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (url, title, content, image, category))
        conn.commit()
        print(f"Successfully inserted: {url}")
    except mysql.connector.IntegrityError:
         # This catches cases where the URL or other unique constraints already exist
         print(f"Article already exists or constraint failed: {url}")
    except Exception as e:
        print(f"Database error during insertion: {e}")
    finally:
        cursor.close()
        conn.close()

def article_exists(url):
    """
    Checks if an article with the given URL already exists in the database.
    
    Args:
        url (str): The URL to check.
        
    Returns:
        bool: True if the article exists, False otherwise.
    """
    conn = get_connection()
    cursor = conn.cursor()
    try:
        query = "SELECT url FROM articles WHERE url = %s"
        cursor.execute(query, (url,))
        result = cursor.fetchone()
        return result is not None
    except Exception as e:
        print(f"Database error during check: {e}")
        return False
    finally:
        cursor.close()
        conn.close()
