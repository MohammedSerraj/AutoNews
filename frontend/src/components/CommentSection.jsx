
import React, { useState } from 'react';
import CommentItem from './CommentItem';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function CommentSection({ articleId, initialComments, onUpdate }) {
  const { user, token, isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          article_id: articleId,
          content: content,
          recaptcha_token: await executeRecaptcha('comment'),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setContent('');
        onUpdate(); // Refresh the article to get the new comment
      } else {
        setError(data.message || 'An error occurred while posting your comment.');
      }
    } catch (err) {
      setError('Connection to server failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId, replyContent) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          article_id: articleId,
          parent_id: parentId,
          content: replyContent,
          recaptcha_token: await executeRecaptcha('reply'),
        }),
      });

      if (response.ok) {
        onUpdate();
        return true;
      }
    } catch (err) {
      console.error('Error replying:', err);
    }
    return false;
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleLike = async (id, type) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          type: type,
        }),
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (err) {
      console.error('Error liking:', err);
    }
  };

  return (
    <div className="mt-16 pt-12 border-t border-gray-200">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-2xl font-bold font-nyt-heading tracking-tight">
          Comments ({initialComments?.length || 0})
        </h3>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
          Join the conversation
        </p>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handlePostComment} className="mb-12">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            placeholder="Share your thoughts on this story..."
            className="w-full p-4 border border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition-all text-sm resize-none h-28 disabled:opacity-50"
            required
          />
          {error && <p className="mt-2 text-xs text-red-600 italic">{error}</p>}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </>
              ) : (
                'Post Comment'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-12 p-8 border border-gray-100 bg-gray-50 text-center rounded-sm">
          <p className="text-gray-500 text-sm italic mb-4">
            Sign in to start a conversation or reply to others.
          </p>
          <Link 
            to="/login"
            className="inline-block border border-black px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all transform active:scale-95"
          >
            Sign In to Comment
          </Link>
        </div>
      )}

      {/* Comment List */}
      <div className="space-y-10">
        {initialComments && initialComments.length > 0 ? (
          initialComments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment}
              user={user}
              token={token}
              onReply={handleReply}
              onDelete={handleDelete}
              onLike={handleLike}
            />
          ))
        ) : (
          <div className="py-20 text-center border-y border-gray-50 bg-gray-50/30 rounded-sm">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest italic">
              No comments yet. Be the first to share your voice.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
