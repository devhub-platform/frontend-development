import React, { useState } from "react";
import { MessageCircle, Share2, Bookmark, UserRoundPen } from "lucide-react";
import img from "../../assets/images/teamimage.png";

const reactionEmojis = [
  { emoji: "👍", label: "Like" },
  { emoji: "❤️", label: "Love" },
  { emoji: "👏", label: "Support" },
  { emoji: "💡", label: "Insighful" },
  { emoji: "🥱", label: "Boring" },
  { emoji: "👎", label: "Dislike" },
];

export function Post({
  // image,
  // author,
  // date,
  // readingTime,
  // title,
  // excerpt,
  tags = ["React", "JavaScript", "Web Development"],
  // reactions,
  // comments,
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [showReactions, setShowReactions] = useState(false);

  return (
    <article className="w-full bg-white border-b border-gray-400 hover:bg-gray-50 transition p-5 mt-2 shadow-sm
                      dark:bg-bg-secondary-dark dark:border-gray-700 dark:hover:bg-bg-secondary-dark">
      <div className="flex gap-6">
        {/* Left */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Author */}
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-text-light rounded-full overflow-hidden w-9 h-9 flex justify-center items-center text-white">
                <UserRoundPen size={30} strokeWidth={2}/>
            </div>
            <span className="text-gray-900 dark:text-white">Jhon Doe</span>
            <span className="text-gray-400 dark:text-gray-300">•</span>
            <span className="text-gray-500 dark:text-gray-200">Oct 8, 2025</span>
            <span className="text-gray-400 dark:text-gray-300">•</span>
            <span className="text-gray-500 dark:text-gray-200">8 min</span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold line-clamp-2 cursor-pointer hover:text-text-light dark:hover:text-text-dark">
            Building Scalable Microservices Architecture with Node.js and Docker
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm line-clamp-2 dark:text-white">Learn how to design and implement a production-ready microservices architecture using Node.js,
             Docker, and Kubernetes. This comprehensive guide covers service discovery, load, bla bla bla</p>

          {/* Tags + Actions */}
          <div className="flex items-center justify-between mt-auto">
            {/* Tags */}
            <div className="flex gap-2 flex-wrap">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
              </div>

              <div className="flex justify-between text-gray-500">
                {/* Actions */}
            <div className="flex items-center gap-4 text-gray-500 relative">
              {/* Reactions */}
              <div className="relative">
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="flex items-center gap-1 hover:text-text-light dark:hover:text-text-dark dark:text-gray-200"
                >
                  <span className="text-lg">
                    {selectedReaction || "👍"}
                  </span>
                  <span>100</span>
                </button>

                {showReactions && (
                  <div className="absolute bottom-10 left-0 bg-white border shadow-lg rounded-full p-2 flex gap-1 z-10 border-gray-300
                                  dark:bg-bg-primary-dark dark:border-gray-700">
                    {reactionEmojis.map((reaction) => (
                      <button
                        key={reaction.label}
                        onClick={() => {
                          setSelectedReaction(reaction.emoji);
                          setShowReactions(false);
                        }}
                        className="text-xl hover:scale-125 transition"
                        title={reaction.label}
                      >
                        {reaction.emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              

              {/* Comment */}
              <button className="flex items-center gap-1 hover:text-text-light dark:hover:text-text-dark dark:text-gray-200">
                <MessageCircle className="w-5 h-5" />
                <span>100</span>
              </button>

              {/* Share */}
              <button className="hover:text-text-light dark:hover:text-text-dark dark:text-gray-200">
                <Share2 className="w-5 h-5" />
              </button>

            </div>
              {/* Bookmark */}
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="hover:text-text-light dark:hover:text-text-dark dark:text-gray-200"
              >
                <Bookmark
                  className="w-5 h-5"
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              </button>
          </div>
        </div>

        {/* Image */}
        <div className="w-[110px] h-[110px] shrink-0">
          <img
            src={img}
            alt="Post Image"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>
    </article>
  );
}

export default Post;
