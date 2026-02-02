import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Share2, Bookmark, UserRoundPen, Eye, ThumbsUp } from "lucide-react";

const reactionEmojis = [
  { emoji: "👍", label: "Like" },
  { emoji: "❤️", label: "Love" },
  { emoji: "👏", label: "Support" },
  { emoji: "💡", label: "Insightful" },
  { emoji: "🥱", label: "Boring" },
  { emoji: "👎", label: "Dislike" },
];

const Post = ({ post, isReactionOpen, setOpenReactionId }) => {
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [reactionsCount, setReactionsCount] = useState(post.reactionsCount);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleReactionSelect = (emoji) => {
    if (selectedReaction === emoji) {
      setReactionsCount((prev) => prev - 1);
      setSelectedReaction(null);
    } else {
      if (selectedReaction) setReactionsCount((prev) => prev - 1);
      setReactionsCount((prev) => prev + 1);
      setSelectedReaction(emoji);
    }
    setOpenReactionId(null); // close popup after select
  };

  return (
    <article className="w-full bg-white border-b border-gray-300 hover:bg-gray-50 p-5 
                        dark:bg-bg-secondary-dark relative dark:border-gray-700 dark:hover:bg-gray-800/50">
      <div className="flex gap-6">
        {/* Left */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Author */}
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-text-light rounded-full min-w-9 min-h-9 flex justify-center items-center text-white">
              <UserRoundPen size={20} />
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="dark:text-white">{post.author}</span>
              <span className="text-gray-400 hidden md:block">•</span>
              <div className="flex gap-2">
                <span className="text-gray-500 dark:text-gray-300">{post.date}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 dark:text-gray-300">{post.readingTime}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <Link to={`/post/${post.id}`}>
            <h2 className="text-xl font-semibold line-clamp-2 cursor-pointer hover:text-text-light dark:hover:text-text-dark">
              {post.title}
            </h2>
          </Link>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm line-clamp-2 dark:text-white">{post.excerpt}</p>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {post.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-xs px-2 py-1 rounded-full dark:bg-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700">
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center text-gray-500 mt-2 dark:text-gray-300">
            <div className="flex gap-4 relative">
              {/* Reactions */}
              <div className="relative">
                <button
                  onClick={() => setOpenReactionId(isReactionOpen ? null : post.id)}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <span>{selectedReaction || <ThumbsUp className="w-5 h-5" />}</span>
                  <span>{reactionsCount}</span>
                </button>

                {isReactionOpen && (
                  <div className="absolute -top-13 bg-white border shadow rounded-full p-2 flex gap-1 z-10 dark:bg-gray-800 dark:border-gray-700 border-gray-300">
                    {reactionEmojis.map((r) => (
                      <button key={r.label} onClick={() => handleReactionSelect(r.emoji)} className="text-xl hover:scale-125 transition">
                        {r.emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments */}
              <button className="flex items-center gap-1 cursor-pointer">
                <MessageCircle size={18} />
                <span>{post.commentsCount}</span>
              </button>

              {/* Views */}
              <div className="flex items-center gap-1 ">
                <Eye size={18} />
                <span>{post.views}</span>
              </div>
            </div>

            
          <div className="flex gap-3 items-center">
            {/* Bookmark */}
            <button onClick={() => setIsBookmarked(!isBookmarked)} className="cursor-pointer text-text-light dark:text-text-dark">
              <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
            </button>

              {/* Share */}
              <Share2 size={18} className="cursor-pointer text-gray-500 dark:text-gray-300"/>
          </div>
          </div>
        </div>

        {/* Image */}
        <Link to={`/post/${post.id}`} className="w-27.5 h-27.5 shrink-0">
          <img src={post.image} alt="Post" className="w-full h-full object-cover rounded-xl" />
        </Link>
      </div>
    </article>
  );
};

export default Post;
