import { Send, Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export function CommentSection({ initialComments }) {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [likedComments, setLikedComments] = useState(new Set());
  const [likedReplies, setLikedReplies] = useState(new Set());

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        author: {
          name: 'You',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        },
        text: newComment,
        time: 'Just now',
        likes: 0,
        replies: [],
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleSubmitReply = (commentId) => {
    if (replyText.trim()) {
      const reply = {
        id: Date.now(),
        author: {
          name: 'You',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        },
        text: replyText,
        time: 'Just now',
        likes: 0,
      };
      setComments(
        comments.map((c) =>
          c.id === commentId ? { ...c, replies: [...(c.replies || []), reply] } : c
        )
      );
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const toggleLikeComment = (commentId) => {
    const newLikedComments = new Set(likedComments);
    if (newLikedComments.has(commentId)) {
      newLikedComments.delete(commentId);
      setComments(
        comments.map((c) =>
          c.id === commentId ? { ...c, likes: c.likes - 1 } : c
        )
      );
    } else {
      newLikedComments.add(commentId);
      setComments(
        comments.map((c) =>
          c.id === commentId ? { ...c, likes: c.likes + 1 } : c
        )
      );
    }
    setLikedComments(newLikedComments);
  };

  const toggleLikeReply = (commentId, replyId) => {
    const newLikedReplies = new Set(likedReplies);
    if (newLikedReplies.has(replyId)) {
      newLikedReplies.delete(replyId);
      setComments(
        comments.map((c) =>
          c.id === commentId
            ? {
                ...c,
                replies: c.replies?.map((r) =>
                  r.id === replyId ? { ...r, likes: r.likes - 1 } : r
                ),
              }
            : c
        )
      );
    } else {
      newLikedReplies.add(replyId);
      setComments(
        comments.map((c) =>
          c.id === commentId
            ? {
                ...c,
                replies: c.replies?.map((r) =>
                  r.id === replyId ? { ...r, likes: r.likes + 1 } : r
                ),
              }
            : c
        )
      );
    }
    setLikedReplies(newLikedReplies);
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Comments ({comments.length})
      </h2>

      {/* Add comment */}
      <div className="mb-8 flex gap-3">
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
          alt="Your avatar"
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-text-light dark:focus:ring-text-dark focus:border-transparent"
          />
          <button
            onClick={handleSubmitComment}
            className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-text-light dark:hover:bg-text-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newComment.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id}>
            {/* Main Comment */}
            <div className="flex gap-3">
              <img
                src={comment.author.avatar}
                alt={comment.author.name}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="flex-1">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{comment.author.name}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-300">{comment.time}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200">{comment.text}</p>
                </div>
                <div className="flex items-center gap-4 mt-2 ml-2">
                  <button
                    onClick={() => toggleLikeComment(comment.id)}
                    className={`cursor-pointer flex items-center gap-1 text-sm transition-colors ${
                      likedComments.has(comment.id)
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-gray-500 dark:text-gray-300'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${likedComments.has(comment.id) ? 'fill-current' : ''}`}
                    />
                    <span>{comment.likes > 0 ? comment.likes : 'Like'}</span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-300 cursor-pointer transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                </div>

                {/* Reply input */}
                {replyingTo === comment.id && (
                  <div className="mt-3 ml-2 flex gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                      alt="Your avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply(comment.id)}
                        placeholder="Write a reply..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-text-light dark:focus:ring-text-dark focus:border-transparent"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSubmitReply(comment.id)}
                        className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-text-light dark:hover:bg-text-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!replyText.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Replies list */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 ml-6 space-y-3 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <img
                          src={reply.author.avatar}
                          alt={reply.author.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{reply.author.name}</h4>
                              <span className="text-xs text-gray-500 dark:text-gray-300">{reply.time}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-200">{reply.text}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-1 ml-2">
                            <button
                              onClick={() => toggleLikeReply(comment.id, reply.id)}
                              className={`flex items-center gap-1 text-xs transition-colors ${
                                likedReplies.has(reply.id)
                                  ? 'text-red-500 hover:text-red-600'
                                  : 'text-gray-500 dark:text-gray-300 hover:text-text-light dark:hover:text-text-dark'
                              }`}
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${
                                  likedReplies.has(reply.id) ? 'fill-current' : ''
                                }`}
                              />
                              <span>{reply.likes > 0 ? reply.likes : 'Like'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
