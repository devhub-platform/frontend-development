import {
  MessageCircle,
  Bookmark,
  Share2,
  Volume2,
  Eye,
  ThumbsUp,
  Square,
  Loader2,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "../../config/api";

const REACTION_EMOJIS = [
  { emoji: "👍", label: "like" },
  { emoji: "❤️", label: "love" },
  { emoji: "😮", label: "wow" },
  { emoji: "😢", label: "sad" },
  { emoji: "😡", label: "angry" },
];

export function InteractionBar({ postId, commentsCount, views, content }) {
  // --- States الـ Reactions والـ Audio ---
  const [selectedReaction, setSelectedReaction] = useState(() => {
    return localStorage.getItem(`post_react_${postId}`) || null;
  });
  const [reactionCount, setReactionCount] = useState(0);
  const [showReactions, setShowReactions] = useState(false);
  const [reactionLoading, setReactionLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // --- States الـ Reading List الجديدة ---
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [lists, setLists] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const token = localStorage.getItem("userToken");
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  // تشيك على حالة الرياكشن وحالة الـ Bookmark للبوست عند تحميل الصفحة
  useEffect(() => {
    if (!postId) return;

    // 1. تحديث الرياكشن الحالي من الكاش
    const savedReact = localStorage.getItem(`post_react_${postId}`);
    setSelectedReaction(savedReact);

    // 2. جلب إجمالي الرياكشنز
    axiosInstance
      .get(`/posts/${postId}/reactions-count`, { headers })
      .then(({ data }) => {
        const reactionsObj = data?.["all reactions count"] || {};
        const count = Object.values(reactionsObj).reduce((a, b) => a + b, 0);
        setReactionCount(count);
      })
      .catch(() => {});

    // 3. التحقق مما إذا كان البوست موجود مسبقاً في الـ Reading List
    const checkBookmarkStatus = async () => {
      try {
        const { data } = await axiosInstance.get("/reading-lists/lists/posts", {
          headers,
        });
        const allLists = data.data || [];
        const exists = allLists.some(
          (list) => list.posts && list.posts.some((p) => p.id === postId),
        );
        setIsBookmarked(exists);
        setLists(allLists);
      } catch (error) {
        console.error("Error checking bookmark status", error);
      }
    };

    checkBookmarkStatus();
  }, [postId]);

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  // --- دالة التحكم بالصوت ---
  const handleListen = () => {
    const synth = window.speechSynthesis;
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }
    if (!content) return;
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synth.speak(utterance);
  };

  // --- دالة التحكم بالـ Reactions ---
  const handleReactionClick = async (emoji, label) => {
    if (reactionLoading) return;
    setReactionLoading(true);
    setShowReactions(false);

    const isCurrentReaction = selectedReaction === label;

    try {
      if (isCurrentReaction) {
        await axiosInstance.delete(`/posts/${postId}/remove-react`, {
          headers,
        });
        setReactionCount((p) => Math.max(0, p - 1));
        setSelectedReaction(null);
        localStorage.removeItem(`post_react_${postId}`);
      } else {
        await axiosInstance.post(
          `/posts/${postId}/react`,
          { type: label },
          { headers },
        );
        if (!selectedReaction) {
          setReactionCount((p) => p + 1);
        }
        setSelectedReaction(label);
        localStorage.setItem(`post_react_${postId}`, label);
      }
    } catch (error) {
      console.error("Reaction failed:", error);
    } finally {
      setReactionLoading(false);
    }
  };

  // --- دالة جلب قوائم القراءة ---
  const fetchLists = async () => {
    if (isListOpen) {
      setIsListOpen(false);
      return;
    }

    setIsListOpen(true);
    setListLoading(true);
    try {
      const { data } = await axiosInstance.get("/reading-lists/lists/posts", {
        headers,
      });
      setLists(data.data || []);
    } catch (error) {
      console.error("Error fetching lists", error);
    } finally {
      setListLoading(false);
    }
  };

  // --- دالة إنشاء قائمة قراءة جديدة ---
  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    try {
      setListLoading(true);
      await axiosInstance.post(
        "/reading-lists",
        { title: newListTitle, description: "" },
        { headers },
      );
      setNewListTitle("");
      setIsCreating(false);

      const { data } = await axiosInstance.get("/reading-lists/lists/posts", {
        headers,
      });
      setLists(data.data || []);
    } catch (error) {
      console.error("Error creating list", error);
    } finally {
      setListLoading(false);
    }
  };

  // --- دالة إضافة البوست لقائمة معينة ---
  const addPostToList = async (listId) => {
    setListLoading(true);
    try {
      await axiosInstance.post(
        `/reading-lists/${listId}/add-post/${postId}`,
        {},
        { headers },
      );

      setIsListOpen(false);
      setIsBookmarked(true);
      alert("Post added to list successfully!");
    } catch (error) {
      console.error("Error adding post to list", error);
      alert("Post already exists in the list.");
    } finally {
      setListLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch (_) {
      alert("Could not copy link.");
    }
  };

  const getCurrentEmoji = () => {
    const found = REACTION_EMOJIS.find((r) => r.label === selectedReaction);
    return found ? found.emoji : null;
  };

  return (
    <div className="py-6 border-y border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        {/* القسم الأيسر: Reactions, Comments, Views */}
        <div className="flex items-center gap-6">
          {/* Reaction picker */}
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="flex items-center gap-2 text-gray-600 hover:text-text-light dark:text-gray-300 dark:hover:text-text-dark transition-colors"
            >
              {reactionLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="text-xl">
                  {getCurrentEmoji() || <ThumbsUp className="w-5 h-5" />}
                </span>
              )}
              <span className="text-sm font-medium">{reactionCount}</span>
            </button>

            {showReactions && (
              <div className="absolute bottom-full left-0 mb-2 flex gap-2 bg-white rounded-full shadow-lg px-3 py-2 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 z-20">
                {REACTION_EMOJIS.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => handleReactionClick(r.emoji, r.label)}
                    title={r.label}
                    className={`text-xl transition-transform hover:scale-125 ${
                      selectedReaction === r.label
                        ? "scale-125 bg-gray-100 dark:bg-gray-700 rounded-full p-1"
                        : ""
                    }`}
                  >
                    {r.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{commentsCount}</span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Eye className="w-5 h-5" />
            <span className="text-sm">{views}</span>
          </div>
        </div>

        {/* القسم الأيمن: Listen, Bookmark (Reading List), Share */}
        <div className="flex items-center gap-4 relative">
          {/* Listen */}
          <button
            onClick={handleListen}
            className={`flex items-center gap-2 transition-colors ${
              isSpeaking
                ? "text-text-light dark:text-text-dark font-bold animate-pulse"
                : "text-gray-600 hover:text-text-light dark:text-gray-300 dark:hover:text-text-dark"
            }`}
          >
            {isSpeaking ? (
              <Square className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">
              {isSpeaking ? "Stop" : "Listen"}
            </span>
          </button>

          {/* Bookmark (Reading List Dropdown Trigger) */}
          <div className="relative">
            <button
              onClick={fetchLists}
              className="text-gray-600 hover:text-text-light dark:text-gray-300 dark:hover:text-text-dark transition-colors"
            >
              <Bookmark
                className={`w-5 h-5 transition-transform hover:scale-110 ${
                  isBookmarked
                    ? "fill-text-light text-text-light dark:fill-text-dark dark:text-text-dark"
                    : ""
                }`}
              />
            </button>

            {/* القائمة المنسدلة للـ Reading List */}
            {isListOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-70 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 p-3 overflow-hidden">
                <h4 className="text-md font-bold mb-3 dark:text-white border-b pb-2 dark:border-gray-700">
                  Add to Reading List
                </h4>

                <div className="max-h-48 overflow-y-auto mb-2 custom-scrollbar">
                  {listLoading && (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto my-2 text-primary" />
                  )}
                  {!listLoading && lists.length === 0 && !isCreating && (
                    <p className="text-xs text-gray-500 text-center py-2 dark:text-gray-400">
                      No lists found.
                    </p>
                  )}
                  {!listLoading &&
                    lists.map((list) => (
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
                  <form onSubmit={handleCreateList} className="mt-2 flex gap-1">
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
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            className="text-gray-600 hover:text-text-light dark:text-gray-300 dark:hover:text-text-dark transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
