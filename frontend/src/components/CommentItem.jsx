
import React, { useState } from 'react';
import { FiMessageSquare, FiHeart, FiTrash2, FiCornerDownRight } from 'react-icons/fi';

export default function CommentItem({ comment, user, token, onReply, onDelete, onLike }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    await onLike(comment.id, 'Comment');
    setIsLiking(false);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    const success = await onReply(comment.id, replyContent);
    if (success) {
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const canDelete = user && user.id === comment.user_id;

  return (
    <div className="mb-6">
      <div className="flex space-x-4">
        {/* Avatar Placeholder */}
        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 flex items-center justify-center text-gray-500 font-bold uppercase text-sm border">
          {comment.user.name.charAt(0)}
        </div>

        <div className="flex-grow">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold">{comment.user.name}</h4>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            {comment.content}
          </p>

          <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-wider">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-1.5 transition-colors ${comment.is_liked ? 'text-black' : 'text-gray-400 hover:text-black'}`}
            >
              <FiHeart className={`w-3.5 h-3.5 ${comment.is_liked ? 'fill-current' : ''}`} />
              <span>{comment.likes_count > 0 ? comment.likes_count : 'Like'}</span>
            </button>

            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center space-x-1.5 text-gray-400 hover:text-black transition-colors"
            >
              <FiMessageSquare className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>

            {canDelete && (
              <button 
                onClick={() => onDelete(comment.id)}
                className="flex items-center space-x-1.5 text-gray-300 hover:text-red-600 transition-colors"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>

          {/* Reply Form */}
          {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full p-3 border border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition-all text-sm resize-none h-20"
                required
              />
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                  Post Reply
                </button>
              </div>
            </form>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-6 ml-4 border-l-2 border-gray-100 pl-6 space-y-6">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="relative">
                  {/* Visual Connector */}
                  <div className="absolute -left-6 top-5 w-4 h-0.5 bg-gray-100"></div>
                  
                  <div className="flex items-center space-x-4 mb-1">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-50 flex items-center justify-center text-gray-400 font-bold uppercase text-[10px] border">
                      {reply.user.name.charAt(0)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold">{reply.user.name}</h5>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                          {new Date(reply.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-2 ml-12">
                    {reply.content}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-wider ml-12">
                     <button 
                        onClick={() => onLike(reply.id, 'Comment')}
                        className={`flex items-center space-x-1.5 transition-colors ${reply.is_liked ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                      >
                        <FiHeart className={`w-3 h-3 ${reply.is_liked ? 'fill-current' : ''}`} />
                        <span>{reply.likes_count > 0 ? reply.likes_count : 'Like'}</span>
                      </button>
                      {user && user.id === reply.user_id && (
                        <button 
                          onClick={() => onDelete(reply.id)}
                          className="flex items-center space-x-1.5 text-gray-300 hover:text-red-600 transition-colors"
                        >
                          <FiTrash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
