import React, { useEffect, useState } from 'react'
import { FiSearch, FiClock, FiSun, FiCloud, FiCloudRain, FiRefreshCw } from 'react-icons/fi'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import { ArticleListSkeleton, HorizontalArticleSkeleton } from '../components/Skeleton'

export default function Home() {
  const { categoryName } = useParams()
  
  const [articles, setArticles] = useState([])
  const [activeCategory, setActiveCategory] = useState(categoryName || null)
  const [loading, setLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Sync state with URL parameter - Reset everything on category change
  useEffect(() => {
    setActiveCategory(categoryName || null)
    setArticles([])
    setPage(1)
    setHasMore(true)
  }, [categoryName])

  // Fetch articles based on activeCategory and page
  useEffect(() => {
    const fetchArticles = async () => {
      if (page === 1) setLoading(true)
      else setIsFetchingMore(true)

      try {
        let url = `http://127.0.0.1:8000/api/articles?page=${page}&`
        if (activeCategory) url += `category=${encodeURIComponent(activeCategory)}&`
        
        const response = await fetch(url)
        const result = await response.json()
        
        // Laravel paginate() returns data inside a 'data' object which has another 'data' array
        const newArticles = result.data.data || []
        const lastPage = result.data.last_page || 1

        setArticles(prev => page === 1 ? newArticles : [...prev, ...newArticles])
        setHasMore(page < lastPage)
      } catch (e) {
        console.error('Error fetching articles:', e)
      } finally {
        setLoading(false)
        setIsFetchingMore(false)
      }
    }

    fetchArticles()
  }, [activeCategory, page])

  const handleLoadMore = () => {
    if (!isFetchingMore && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  // Layout groups - fixed positions
  const featuredArticle = articles[0]
  const mainArticles = articles.slice(1, 4)
  const topStories = articles.slice(4, 10)
  const moreStories = articles.slice(10)

  return (
    <div className="container mx-auto px-4 py-6">

      {/* Loading Initial State (Only on first load) */}
      {loading && articles.length === 0 && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="w-full h-96 bg-gray-100 animate-pulse rounded-lg" />
            </div>
            <div className="space-y-6">
              <div className="h-4 w-32 bg-gray-100 animate-pulse" />
              {[1, 2, 3, 4].map(i => <div key={i} className="h-16 w-full bg-gray-50 animate-pulse" />)}
            </div>
          </div>
          <ArticleListSkeleton count={6} />
        </div>
      )}

      {/* Featured & Main Stories - Always visible once first articles loaded */}
      {articles.length > 0 && (
        <>
          {featuredArticle && (
            <div className="mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 relative group overflow-hidden bg-black rounded-lg shadow-xl cursor-pointer">
                  <Link to={`/article/${featuredArticle.id}`} state={{ article: featuredArticle }}>
                    {featuredArticle.image ? (
                      <img
                        src={featuredArticle.image}
                        alt={featuredArticle.title}
                        className="w-full h-96 object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    ) : (
                      <div className="w-full h-96 bg-gray-900" />
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 p-8 w-full">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="px-2 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-sm">
                          Featured
                        </span>
                        <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
                          {featuredArticle.category || 'World'}
                        </span>
                      </div>
                      
                      <h2 className="text-white text-3xl md:text-4xl font-bold mb-4 leading-tight group-hover:underline decoration-white/30 underline-offset-4">
                        {featuredArticle.title}
                      </h2>
                      
                      <div className="flex items-center justify-between text-white/70">
                        <div className="flex items-center space-x-4 text-xs">
                          <span className="flex items-center">
                            <FiClock className="inline w-3 h-3 mr-1.5" />
                            {new Date(featuredArticle.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-sm font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                          Read Full Story <span className="ml-2">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="border-l border-gray-200 pl-8">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Latest Updates</h3>
                  <div className="space-y-6">
                    {mainArticles.map((article) => (
                      <div key={article.id} className="pb-4 border-b border-gray-100">
                        <h4 className="font-bold mb-1">
                          <Link to={`/article/${article.id}`} className="hover:text-gray-600">
                            {article.title}
                          </Link>
                        </h4>
                        <p className="text-xs text-gray-500">{new Date(article.created_at).toLocaleDateString()}</p>
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
                Fresh perspectives from Tangier
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topStories.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* "More Stories" List - Grows as you load more */}
      {articles.length > 10 && (
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            {page === 1 ? 'More Stories' : 'Continuing Coverage'}
            <span className="ml-4 h-px bg-gray-100 flex-grow"></span>
          </h3>
          <div className="space-y-4">
            {moreStories.map((article) => (
              <div key={article.id} className="py-4 border-b border-gray-100 hover:bg-gray-50 px-2 group">
                <div className="flex items-start space-x-4">
                  {article.image && (
                    <div className="w-20 h-20 overflow-hidden flex-shrink-0 bg-gray-100 rounded-sm">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex-grow min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">
                      {article.category || 'General'}
                    </span>
                    <h4 className="font-bold mb-1 truncate md:whitespace-normal">
                      <Link to={`/article/${article.id}`} className="hover:text-gray-600">
                        {article.title}
                      </Link>
                    </h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2 hidden md:block">
                      {(article.content || '').slice(0, 160)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-medium">{new Date(article.created_at).toLocaleDateString()}</span>
                      <Link to={`/article/${article.id}`} className="text-[10px] font-bold uppercase tracking-widest text-black hover:underline underline-offset-4">
                        Read Story →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading Skeletons for "More Stories" */}
          {isFetchingMore && (
            <div className="mt-4 space-y-4">
              {[1, 2, 3].map(i => <HorizontalArticleSkeleton key={i} />)}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && !isFetchingMore && (
            <div className="mt-12 text-center">
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center space-x-3 px-12 py-4 border-2 border-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all transform active:scale-95 group"
              >
                {isFetchingMore ? (
                  <FiRefreshCw className="animate-spin w-4 h-4" />
                ) : (
                  <>
                    <span>Load More Stories</span>
                    <span className="group-hover:translate-y-1 transition-transform">↓</span>
                  </>
                )}
              </button>
            </div>
          )}

          {!hasMore && articles.length > 0 && (
            <div className="mt-16 text-center">
              <div className="inline-block px-6 py-2 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
                You've caught up with all the news
              </div>
            </div>
          )}
        </div>
      )}

      {/* No articles state */}
      {!loading && articles.length === 0 && (
        <div className="text-center py-24 border-2 border-dashed border-gray-100 rounded-xl">
          <div className="mb-6 opacity-20 flex justify-center">
             <FiSearch className="w-16 h-16" />
          </div>
          <h3 className="text-xl font-bold mb-2">No stories found</h3>
          <p className="text-gray-500 italic max-w-sm mx-auto">
            We couldn't find any articles in this category. Explore our other sections for the latest from Morocco.
          </p>
          <Link 
            to="/" 
            className="mt-8 inline-block text-[10px] font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:opacity-60 transition-opacity"
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  )
}
