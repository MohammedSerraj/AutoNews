import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiBookmark, FiShare2, FiArrowLeft, FiClock, FiTag, FiHeart, FiMessageSquare } from 'react-icons/fi';
import { BookmarkContext } from '../context/BookmarkContext';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';

export default function ArticleDetail() {
  const { id } = useParams();
  const { bookmarks, toggleBookmark } = useContext(BookmarkContext);
  const { user, token, isAuthenticated } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLiking, setIsLiking] = useState(false);

  const fetchArticle = async () => {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`http://127.0.0.1:8000/api/articles/${id}`, { headers });
      const data = await response.json();
      setArticle(data.data || null);
    } catch (e) {
      console.error(e);
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/articles/${id}/related`);
      const data = await response.json();
      setRelatedArticles(data.data || []);
    } catch (e) {
      console.error('Error fetching related articles:', e);
    }
  };

  useEffect(() => {
    fetchArticle();
    fetchRelatedArticles();
    // Scroll to top when ID changes
    window.scrollTo(0, 0);
  }, [id, token]);

  const handleArticleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          id: article.id,
          type: 'Article',
        }),
      });

      if (response.ok) {
        fetchArticle();
      }
    } catch (err) {
      console.error('Error liking article:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const shareArticle = (platform) => {
    const url = window.location.href;
    const title = article?.title || 'Check out this article on TangierTimes';
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'native':
      default:
        if (navigator.share) {
          navigator.share({ title, url }).catch(console.error);
        } else {
          navigator.clipboard.writeText(url);
          alert('Link copied to clipboard!');
        }
        break;
    }
  };

  const bookmarked = article ? bookmarks.some((b) => b.id === article.id) : false;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        <p className="mt-2 text-gray-600">Loading article...</p>
      </div>
    );
  }

  if (!article) return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">Article not available</h2>
      <p className="text-gray-600 mb-6">The article you're looking for could not be found.</p>
      <Link to="/" className="border border-black px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all transform active:scale-95 inline-flex items-center">
        <FiArrowLeft className="mr-2" />
        Back to Home
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Navigation */}
      <Link to="/" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-10 transition-colors">
        <FiArrowLeft className="mr-2" />
        Back to all stories
      </Link>

      {/* Article Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{article.category || 'News'}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center border-l border-gray-200 pl-6">
              <FiClock className="w-3.5 h-3.5 mr-2" />
              {new Date(article.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {/* Social Engagement */}
            <div className="flex items-center space-x-4 mr-6 border-r border-gray-200 pr-6">
               <button 
                onClick={handleArticleLike}
                className={`flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${article.is_liked ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                title="Like this article"
              >
                <FiHeart className={`w-4 h-4 ${article.is_liked ? 'fill-current' : ''}`} />
                <span>{article.likes_count}</span>
              </button>
              <button 
                onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                title="View comments"
              >
                <FiMessageSquare className="w-4 h-4" />
                <span>{article.comments_count}</span>
              </button>
            </div>

            <button 
              onClick={() => shareArticle('native')}
              className="p-2 text-gray-400 hover:text-black transition-colors"
              title="Share article"
            >
              <FiShare2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleBookmark(article)}
              className={`p-2 transition-colors ${
                bookmarked ? 'text-black' : 'text-gray-400 hover:text-black'
              }`}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
              title="Save to bookmarks"
            >
              <FiBookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-8 font-nyt-heading">
          {article.title}
        </h1>

        {article.image && (
          <div className="mb-10 text-center">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-auto max-h-[600px] object-cover shadow-sm"
            />
            <p className="mt-4 text-[10px] text-gray-400 italic text-right uppercase tracking-widest font-medium">Illustration for TangierTimes</p>
          </div>
        )}
      </div>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none mb-20">
        <div className="text-gray-800 leading-[1.8] space-y-8 text-xl font-nyt-body">
          {(article.content || '').split('\n').map((paragraph, idx) => (
            paragraph.trim() && (
              <p key={idx} className="mb-4">
                {paragraph.trim()}
              </p>
            )
          ))}
        </div>
        {article.url && (
          <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Source</span>
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-black font-semibold hover:underline decoration-1 underline-offset-4"
              >
                Original Reporting via Morocco World News
              </a>
            </div>
            <div className="flex space-x-4">
              <button onClick={handleArticleLike} className={`p-3 rounded-full border transition-all ${article.is_liked ? 'bg-black text-white border-black shadow-md' : 'text-gray-400 border-gray-200 hover:border-black hover:text-black'}`}>
                <FiHeart className={`w-5 h-5 ${article.is_liked ? 'fill-current' : ''}`} />
              </button>
              <button onClick={() => toggleBookmark(article)} className={`p-3 rounded-full border transition-all ${bookmarked ? 'bg-black text-white border-black shadow-md' : 'text-gray-400 border-gray-200 hover:border-black hover:text-black'}`}>
                <FiBookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        )}
      </article>

      {/* Article Navigation/Categories */}
      <div className="border-y border-gray-100 py-8 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
            <FiTag className="w-3.5 h-3.5 mr-2" />
            Classified Under
          </h4>
          <div className="flex flex-wrap gap-3">
             <span className="px-5 py-1.5 border border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-widest hover:border-black hover:text-black transition-colors cursor-pointer">
              Morocco
            </span>
            <span className="px-5 py-1.5 border border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-widest hover:border-black hover:text-black transition-colors cursor-pointer">
              Top Stories
            </span>
            <span className="px-5 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest">
              {article.category || 'General'}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
           <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Share with others</h4>
           <div className="flex space-x-3">
              <button 
                onClick={() => shareArticle('native')}
                className="w-10 h-10 flex items-center justify-center border border-gray-100 hover:border-black transition-colors"
                title="Share link"
              >
                <FiShare2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => shareArticle('twitter')}
                className="w-10 h-10 flex items-center justify-center border border-gray-100 hover:border-black transition-colors font-bold text-[10px]"
                title="Share on Twitter"
              >
                TWT
              </button>
              <button 
                onClick={() => shareArticle('facebook')}
                className="w-10 h-10 flex items-center justify-center border border-gray-100 hover:border-black transition-colors font-bold text-[10px]"
                title="Share on Facebook"
              >
                FB
              </button>
           </div>
        </div>
      </div>

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <div className="mb-20 pt-12 border-t border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-8 flex items-center">
            <span className="w-8 h-px bg-gray-200 mr-4"></span>
            More from {article.category || 'this category'}
            <span className="flex-grow h-px bg-gray-200 ml-4"></span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedArticles.map((rel) => (
              <Link 
                key={rel.id} 
                to={`/article/${rel.id}`}
                className="group flex flex-col"
              >
                {rel.image && (
                  <div className="aspect-[4/3] overflow-hidden mb-4 bg-gray-100">
                    <img 
                      src={rel.image} 
                      alt={rel.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">{rel.category}</span>
                <h4 className="text-sm font-bold font-nyt-heading leading-snug group-hover:underline decoration-1 underline-offset-4 mb-2 line-clamp-3">
                  {rel.title}
                </h4>
                <p className="text-[9px] text-gray-400 font-medium uppercase tracking-widest">
                  {new Date(rel.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div id="comments-section">
        <CommentSection 
          articleId={article.id} 
          initialComments={article.comments} 
          onUpdate={fetchArticle} 
        />
      </div>
    </div>
  );
}
