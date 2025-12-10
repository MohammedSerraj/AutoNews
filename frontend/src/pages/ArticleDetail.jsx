
import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiBookmark, FiShare2, FiArrowLeft, FiClock, FiTag } from 'react-icons/fi'
import { BookmarkContext } from '../context/BookmarkContext'

export default function ArticleDetail() {
  const { id } = useParams()
  const { bookmarks, toggleBookmark } = useContext(BookmarkContext)
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`http://127.0.0.1:8000/api/articles/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setArticle(data.data || null)
      })
      .catch((e) => {
        console.error(e)
        setArticle(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  const bookmarked = article ? bookmarks.some((b) => b.id === article.id) : false

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        <p className="mt-2 text-gray-600">Loading article...</p>
      </div>
    )
  }

  if (!article) return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">Article not available</h2>
      <p className="text-gray-600 mb-6">The article you're looking for could not be found.</p>
      <Link to="/" className="btn-nyt flex items-center w-fit mx-auto">
        <FiArrowLeft className="mr-2" />
        Back to Home
      </Link>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Navigation */}
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-black mb-6">
        <FiArrowLeft className="mr-2" />
        Back to all stories
      </Link>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span className="article-meta">{article.category || 'News'}</span>
            <span className="article-meta flex items-center">
              <FiClock className="w-3 h-3 mr-1" />
              {article.date}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <FiShare2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleBookmark(article)}
              className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${
                bookmarked ? 'text-black' : 'text-gray-500'
              }`}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
            >
              <FiBookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <h1 className="text-4xl font-bold leading-tight mb-6">
          {article.title_en || article.title_ar}
        </h1>

        {article.image_url && (
          <div className="mb-8">
            <img
            src={`http://127.0.0.1:8000/static/articles_images/${article.image_url}`}
              alt={article.title_en || article.title_ar}
              className="w-full h-auto max-h-[500px] object-cover"
            />
            <p className="text-sm text-gray-500 mt-2">
              {article.image_caption || 'Photo courtesy of TangierTimes'}
            </p>
          </div>
        )}
      </div>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none mb-12">
        <div className="text-gray-700 leading-relaxed space-y-4">
          {article.content_en || article.content_ar}
        </div>
      </article>

      {/* Article Footer */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center">
              <FiTag className="w-4 h-4 mr-2" />
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                Morocco
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                News
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {article.category || 'General'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-2">Share this article</p>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <span className="text-sm">Twitter</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <span className="text-sm">Facebook</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <span className="text-sm">Email</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
