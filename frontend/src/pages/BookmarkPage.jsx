
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FiBookmark, FiArrowRight, FiClock } from 'react-icons/fi'
import { BookmarkContext } from '../context/BookmarkContext'

export default function Bookmarks() {
  const { bookmarks } = useContext(BookmarkContext)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <FiBookmark className="w-8 h-8 text-black mr-3" />
          <div>
            <h1 className="text-3xl font-bold">Saved Articles</h1>
            <p className="text-gray-600">
              {bookmarks.length} {bookmarks.length === 1 ? 'article' : 'articles'} saved
            </p>
          </div>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <FiBookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No saved articles yet</h3>
          <p className="text-gray-600 mb-6">When you bookmark articles, they'll appear here.</p>
          <Link to="/" className="btn-nyt inline-flex items-center">
            Browse Articles
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((article) => (
            <div key={article.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
              {article.image_url && (
                <img
                  src={`http://127.0.0.1:8000/static/articles_images/${article.image_url}`}
                  alt={article.title_en || article.title_ar}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="article-meta">{article.category || 'News'}</span>
                  <span className="article-meta flex items-center">
                    <FiClock className="w-3 h-3 mr-1" />
                    {article.date}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-3 line-clamp-2">
                  <Link to={`/article/${article.id}`} state={{ article }} className="hover:text-gray-600">
                    {article.title_en || article.title_ar}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {(article.content_en || article.content_ar || '').slice(0, 120)}...
                </p>
                <Link
                  to={`/article/${article.id}`}
                  state={{ article }}
                  className="inline-flex items-center text-sm font-semibold hover:underline"
                >
                  Read article
                  <FiArrowRight className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
