
import React, { useEffect, useState } from 'react'
import { FiSearch, FiClock } from 'react-icons/fi'
import ArticleCard from '../components/ArticleCard'

export default function Home() {
  const [articles, setArticles] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch('http://127.0.0.1:8000/api/articles')
      .then((r) => r.json())
      .then((data) => {
        const articlesArray = Array.isArray(data) ? data : data.data || []
        setArticles(articlesArray)
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [])

  const filtered = articles.filter((a) => {
    const text = (a.title_en || a.title_ar || '') + ' ' + (a.content_en || a.content_ar || '')
    return text.toLowerCase().includes(query.toLowerCase())
  })

  const featuredArticle = filtered[0]
  const mainArticles = filtered.slice(1, 5)
  const remainingArticles = filtered.slice(5)

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Baral */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
          />
        </div>
      </div>

      {/* Featured Article */}
      {featuredArticle && (
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {featuredArticle.image_url && (
                <img
                  src={`http://127.0.0.1:8000/static/articles_images/${featuredArticle.image_url}`}
                  alt={featuredArticle.title_en || featuredArticle.title_ar}
                  className="w-full h-64 object-cover mb-4"
                />
              )}
              <span className="article-meta mb-2">FEATURED</span>
              <h2 className="text-3xl font-bold mb-3 leading-tight">
                {featuredArticle.title_en || featuredArticle.title_ar}
              </h2>
              <p className="text-gray-600 mb-4">
                {(featuredArticle.content_en || featuredArticle.content_ar || '').slice(0, 200)}...
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="article-meta">
                    <FiClock className="inline w-3 h-3 mr-1" />
                    {featuredArticle.date}
                  </span>
                </div>
                <a href={`/article/${featuredArticle.id}`} className="font-semibold hover:underline">
                  Read Full Story →
                </a>
              </div>
            </div>

            {/* Latest Updates */}
            <div className="border-l border-gray-200 pl-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Latest Updates</h3>
              <div className="space-y-6">
                {mainArticles.slice(0, 4).map((article) => (
                  <div key={article.id} className="pb-4 border-b border-gray-100">
                    <h4 className="font-bold mb-1">
                      <a href={`/article/${article.id}`} className="hover:text-gray-600">
                        {article.title_en || article.title_ar}
                      </a>
                    </h4>
                    <p className="text-xs text-gray-500">{article.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Stories Grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Top Stories</h2>
          <div className="text-sm text-gray-500">
            {filtered.length} articles
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>

      {/* More Articles  */}
      {remainingArticles.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-6">More Stories</h3>
          <div className="space-y-4">
            {remainingArticles.map((article) => (
              <div key={article.id} className="py-4 border-b border-gray-100 hover:bg-gray-50 px-2">
                <div className="flex items-start space-x-4">
                  {article.image_url && (
                    <img
                      src={`http://127.0.0.1:8000/static/articles_images/${article.image_url}`}
                      alt={article.title_en || article.title_ar}
                      className="w-20 h-20 object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-grow">
                    <h4 className="font-bold mb-1">
                      <a href={`/article/${article.id}`} className="hover:text-gray-600">
                        {article.title_en || article.title_ar}
                      </a>
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {(article.content_en || article.content_ar || '').slice(0, 120)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="article-meta">{article.date}</span>
                      <a href={`/article/${article.id}`} className="text-sm font-medium hover:underline">
                        Read →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <p className="mt-2 text-gray-600">Loading stories...</p>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No articles found. Try a different search term.</p>
        </div>
      )}
    </div>
  )
}
