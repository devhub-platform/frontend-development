import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Share2,
  Bookmark,
  Eye,
  ThumbsUp,
  Plus,
  Loader2,
  CheckCircle2,
  MoreVertical,
} from "lucide-react";
import axiosInstance from "../../config/api";

const reactionEmojis = [
  { emoji: "👍", label: "like" },
  { emoji: "❤️", label: "love" },
  { emoji: "🤯", label: "explodingHead" },
  { emoji: "🙌", label: "raisedHands" },
  { emoji: "😮", label: "wow" },
  { emoji: "👎", label: "dislike" },
];

const Post = ({
  post,
  isReactionOpen,
  setOpenReactionId,
  menuOptions,
  readingLists = [],
  setReadingLists,
  initialIsBookmarked = false,
  onBookmarkChange,
}) => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("userToken"));

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(
    () => localStorage.getItem(`post_react_${post.id}`) || null,
  );
  const [reactionsCount, setReactionsCount] = useState(
    post.reactionsCount || 0,
  );
  const [reactionLoading, setReactionLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isListOpen, setIsListOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("userToken");
    return { Authorization: `Bearer ${token}`, Accept: "application/json" };
  };

  // لو مش لوجين بيوديه على اللوجين
  const requireAuth = (action) => {
    if (!isLoggedIn) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleReactionClick = async (emoji, label) => {
    if (!requireAuth()) return;
    if (reactionLoading) return;
    setReactionLoading(true);
    setOpenReactionId(null);

    const isCurrentReaction = selectedReaction === label;
    const headers = getAuthHeaders();

    try {
      if (isCurrentReaction) {
        await axiosInstance.delete(`/posts/${post.id}/remove-react`, {
          headers,
        });
        setReactionsCount((p) => Math.max(0, p - 1));
        setSelectedReaction(null);
        localStorage.removeItem(`post_react_${post.id}`);
      } else {
        await axiosInstance.post(
          `/posts/${post.id}/react`,
          { type: label },
          { headers },
        );
        if (!selectedReaction) setReactionsCount((p) => p + 1);
        setSelectedReaction(label);
        localStorage.setItem(`post_react_${post.id}`, label);
      }
    } catch (error) {
      console.error("Reaction action failed:", error);
    } finally {
      setReactionLoading(false);
    }
  };

  const toggleListDropdown = () => {
    if (!requireAuth()) return;
    setIsListOpen((prev) => !prev);
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    setLoading(true);
    try {
      await axiosInstance.post(
        "/reading-lists",
        { title: newListTitle, description: "" },
        { headers: getAuthHeaders() },
      );
      setNewListTitle("");
      setIsCreating(false);
      const { data } = await axiosInstance.get("/reading-lists/lists/posts", {
        headers: getAuthHeaders(),
      });
      setReadingLists?.(data.data || []);
    } catch (error) {
      console.error("Error creating list", error);
    } finally {
      setLoading(false);
    }
  };

  const addPostToList = async (listId) => {
    setLoading(true);
    try {
      await axiosInstance.post(
        `/reading-lists/${listId}/add-post/${post.id}`,
        {},
        { headers: getAuthHeaders() },
      );
      setIsListOpen(false);
      setIsBookmarked(true);
      onBookmarkChange?.(post.id, true);
    } catch (error) {
      console.error("Error adding post to list", error);
      alert("Post already exists in the list.");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentEmoji = () => {
    const found = reactionEmojis.find((r) => r.label === selectedReaction);
    return found ? found.emoji : null;
  };

  return (
    <article className="w-full bg-white border-b border-gray-300 hover:bg-gray-50 p-5 dark:bg-bg-secondary-dark relative dark:border-gray-700 dark:hover:bg-gray-800/50">
      {menuOptions && (
        <div className="absolute top-5 right-5 z-30">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
          >
            <MoreVertical size={20} className="text-gray-500" />
          </button>
          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">
                {menuOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      option.onClick(post.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition ${option.variant === "danger" ? "text-red-500" : "dark:text-gray-200"}`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex gap-6 mx-4 mr-8">
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="min-w-9 min-h-9 w-9 h-9 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
              <img
                src={
                  post.avatar ||
                  `https://ui-avatars.com/api/?name=${post.author}&background=random`
                }
                alt={post.author}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="dark:text-white font-medium">{post.author}</span>
              <span className="text-gray-400">
                • {post.date} • {post.readingTime}
              </span>
            </div>
          </div>

          <Link to={`/post/${post.id}`}>
            <h2 className="text-xl font-semibold line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400">
              {post.title}
            </h2>
          </Link>

          <p className="text-gray-600 text-sm line-clamp-2 dark:text-white">
            {post.excerpt}
          </p>

          <div className="flex gap-2 flex-wrap">
            {post.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-gray-100 text-xs px-2 py-1 rounded-full dark:bg-gray-800 dark:text-gray-100"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center text-gray-500 mt-2 dark:text-gray-300">
            <div className="flex gap-4 relative">
              <div className="relative">
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      navigate("/login");
                      return;
                    }
                    setOpenReactionId(isReactionOpen ? null : post.id);
                  }}
                  className="flex items-center gap-1 cursor-pointer hover:text-text-light dark:hover:text-text-dark transition-colors"
                >
                  {reactionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    getCurrentEmoji() || <ThumbsUp className="w-5 h-5" />
                  )}
                  <span>{reactionsCount}</span>
                </button>

                {isReactionOpen && (
                  <div className="absolute -top-13 bg-white border shadow-lg rounded-full p-2 flex gap-1 z-20 dark:bg-gray-800 dark:border-gray-700">
                    {reactionEmojis.map((r) => (
                      <button
                        key={r.label}
                        onClick={() => handleReactionClick(r.emoji, r.label)}
                        className={`text-xl hover:scale-125 transition ${selectedReaction === r.label ? "scale-110" : ""}`}
                      >
                        {r.emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to={`/post/${post.id}#comments`}
                className="flex items-center gap-1 hover:text-text-light dark:hover:text-text-dark transition-colors"
              >
                <MessageCircle size={18} />
                <span>{post.commentsCount}</span>
              </Link>

              <div className="flex items-center gap-1">
                <Eye size={18} />
                <span>{post.views}</span>
              </div>
            </div>

            <div className="flex gap-3 items-center relative">
              <button
                onClick={toggleListDropdown}
                className="cursor-pointer transition hover:scale-110 text-text-light dark:text-text-dark"
              >
                <Bookmark
                  size={20}
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              </button>

              {isListOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-70 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 p-3 overflow-hidden">
                  <h4 className="text-md font-bold mb-3 dark:text-white border-b pb-2 dark:border-gray-700">
                    Add to Reading List
                  </h4>
                  <div className="max-h-48 overflow-y-auto mb-2 custom-scrollbar">
                    {loading && (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto my-2 text-primary" />
                    )}
                    {!loading && readingLists.length === 0 && !isCreating && (
                      <p className="text-xs text-gray-500 text-center py-2 dark:text-gray-400">
                        No lists found.
                      </p>
                    )}
                    {!loading &&
                      readingLists.map((list) => (
                        <button
                          key={list.id}
                          onClick={() => addPostToList(list.id)}
                          className="w-full flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition group text-left"
                        >
                          <div>
                            <p className="text-sm font-medium dark:text-gray-200">
                              {list.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {list.post_count} posts
                            </p>
                          </div>
                          <Plus
                            size={14}
                            className="opacity-0 group-hover:opacity-100 transition text-text-light dark:text-text-dark"
                          />
                        </button>
                      ))}
                  </div>
                  {isCreating ? (
                    <form
                      onSubmit={handleCreateList}
                      className="mt-2 flex gap-1"
                    >
                      <input
                        autoFocus
                        type="text"
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                        placeholder="List title..."
                        className="flex-1 text-xs p-1.5 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="p-1.5 bg-primary text-white rounded hover:bg-opacity-90 transition"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsCreating(true)}
                      className="w-full mt-2 flex items-center justify-center gap-2 text-xs py-2 rounded-lg bg-primary text-white font-semibold transition hover:bg-opacity-90"
                    >
                      <Plus size={14} /> Create New List
                    </button>
                  )}
                </div>
              )}

              <Share2
                size={18}
                className="cursor-pointer text-gray-500 dark:text-gray-300 hover:text-text-light dark:hover:text-text-dark transition-colors"
              />
            </div>
          </div>
        </div>

        {post.image && post.image.length > 0 && (
          <Link to={`/post/${post.id}`} className="w-30 h-32 shrink-0">
            <img
              src={post.image}
              alt="Post"
              className="w-full h-full object-cover rounded-xl"
            />
          </Link>
        )}
      </div>
    </article>
  );
};

export default Post;
