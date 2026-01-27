import { MessageCircle, Bookmark, Share2, Volume2, Eye } from 'lucide-react';
import { useState } from 'react';

export function InteractionBar({ commentsCount, reactionsCount, views }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [reactionCount, setReactionCount] = useState(reactionsCount);
  const [showReactions, setShowReactions] = useState(false);

  const reactions = [
    { emoji: "👍", label: "Like" },
    { emoji: "❤️", label: "Love" },
    { emoji: "👏", label: "Support" },
    { emoji: "💡", label: "Insightful" },
    { emoji: "🥱", label: "Boring" },
    { emoji: "👎", label: "Dislike" },
  ];

  const handleReactionClick = (emoji) => {
    if (selectedReaction === emoji) {
      // Remove reaction
      setReactionCount((prev) => prev - 1);
      setSelectedReaction(null);
    } else {
      // Remove previous reaction if exists
      if (selectedReaction) setReactionCount((prev) => prev - 1);
      setReactionCount((prev) => prev + 1);
      setSelectedReaction(emoji);
    }
    setShowReactions(false); // close popup after selection
  };

  return (
    <div className="py-6 border-y border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Reaction picker */}
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="flex items-center gap-2 text-gray-600 hover:text-text-light dark:text-gray-300 dark:hover:text-text-dark transition-colors"
            >
              <span>{selectedReaction || "👍"}</span>
              <span className="text-sm font-medium">{reactionCount}</span>
            </button>

            {showReactions && (
              <div className="absolute bottom-full left-0 mb-2 flex gap-2 bg-white rounded-full shadow-lg px-3 py-2 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                {reactions.map((reaction, index) => (
                  <button
                    key={index}
                    className={`text-xl transition-transform ${
                      selectedReaction === reaction.emoji ? 'scale-125' : ''
                    }`}
                    onClick={() => handleReactionClick(reaction.emoji)}
                  >
                    {reaction.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Comments */}
          <button className="flex items-center gap-2 text-gray-600 hover:text-text-light dark:text-gray-300 dark:hover:text-text-dark transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{commentsCount}</span>
          </button>

          <div className="flex items-center gap-2 text-gray-600 hover:text-text-light dark:text-gray-300 dark:hover:text-text-dark transition-colors">
                <Eye size={18} />
                <span>{views}</span>
              </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Listen */}
          <button className="flex items-center gap-2 text-gray-600 hover:text-text-light dark:text-gray-300 dark:hover:text-text-dark transition-colors">
            <Volume2 className="w-5 h-5" />
            <span className="text-sm font-medium">Listen</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className="text-gray-600 hover:text-text-light dark:text-gray-300 dark:hover:text-text-dark transition-colors"
          >
            <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-text-light text-text-light dark:fill-text-dark dark:text-text-dark' : ''}`} />
          </button>

          {/* Share */}
          <button className="text-gray-600 hover:text-text-light dark:text-gray-300 dark:hover:text-text-dark transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
