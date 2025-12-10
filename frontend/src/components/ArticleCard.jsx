
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FiBookmark, FiClock } from 'react-icons/fi'
import { BookmarkContext } from '../context/BookmarkContext'

export default function ArticleCard({ article }) {
  const { bookmarks, toggleBookmark } = useContext(BookmarkContext)
  const bookmarked = bookmarks.some((b) => b.id === article.id)

  return (
    <div className="card-nyt group hover:shadow-lg transition-all duration-200">
      {article.image_url && (
        <div className="relative overflow-hidden">
          <img
            src={`http://127.0.0.1:8000/static/articles_images/${article.image_url}`}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            alt={article.title_en || article.title_ar}
          />
          <button
            onClick={() => toggleBookmark(article)}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
          >
            <FiBookmark 
              className={`w-4 h-4 ${bookmarked ? 'text-black fill-current' : 'text-gray-600'}`}
            />
          </button>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="article-meta">{article.category || 'News'}</span>
          <span className="article-meta flex items-center">
            <FiClock className="w-3 h-3 mr-1" />
            {article.date}
          </span>
        </div>
        <h3 className="article-title text-lg mb-3 line-clamp-2 group-hover:text-gray-600 transition-colors">
          <Link to={`/article/${article.id}`} state={{ article }}>
            {article.title_en || article.title_ar}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {(article.content_en || article.content_ar || '').slice(0, 100)}...
        </p>
        <div>
          <Link
            to={`/article/${article.id}`}
            state={{ article }}
            className="text-sm font-semibold hover:underline flex items-center"
          >
            Read story
            <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
