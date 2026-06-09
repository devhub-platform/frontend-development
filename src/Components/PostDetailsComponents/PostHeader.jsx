import {
  Calendar,
  Clock,
  Check,
  Loader2,
  UserCheck,
  UserPlus,
  MessageCircle,
} from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/api";
import { UserContext } from "../../context/UserContext";

export function PostHeader({
  author,
  authorAvatar,
  authorUsername,
  date,
  readingTime,
  userId,
}) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const navigate = useNavigate();
  const { setSelectedConversationId } = useContext(UserContext);

  // ── استخراج الـ myId من الـ token ──────────────────────────────────────
  const token = localStorage.getItem("userToken");
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  let myId = null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    myId = Number(payload.sub);
  } catch (_) {}

  const isOwnProfile = myId && userId && myId === Number(userId);

  // ── جلب حالة الـ follow الحقيقية من الـ API ────────────────────────────
  useEffect(() => {
    if (!userId || isOwnProfile) {
      setInitialLoading(false);
      return;
    }

    const fetchFollowState = async () => {
      try {
        const { data } = await axiosInstance.get("/followers/my-following", {
          headers,
        });
        const followingIds = new Set(data.following?.map((u) => u.id));
        setIsFollowing(followingIds.has(Number(userId)));
      } catch (err) {
        console.error("Failed to fetch follow state:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchFollowState();
  }, [userId]);

  // ── Follow / Unfollow ──────────────────────────────────────────────────
  const handleFollowToggle = async () => {
    if (followLoading || !userId) return;
    setFollowLoading(true);
    const url = isFollowing
      ? `/users/${userId}/unfollow`
      : `/users/${userId}/follow`;
    try {
      await axiosInstance.post(url, {}, { headers });
      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error("Follow failed:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  // ── Message ────────────────────────────────────────────────────────────
  const handleMessage = async () => {
    if (messageLoading || !userId) return;
    setMessageLoading(true);
    try {
      const res = await axiosInstance.post(
        "/chat/conversations",
        { user_id: userId },
        { headers },
      );
      if (res.status === 200 || res.status === 201) {
        const conversationId =
          res.data?.conversation?.id || res.data?.data?.conversation?.id;
        if (conversationId && typeof setSelectedConversationId === "function") {
          setSelectedConversationId(conversationId);
        }
        navigate("/chat");
      }
    } catch (err) {
      console.error("Message failed:", err);
    } finally {
      setMessageLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 py-6 border-b border-gray-200 dark:border-gray-700">
      {/* ── Avatar + Info ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => userId && navigate(`/users/${userId}`)}
          className="shrink-0"
        >
          <img
            src={
              authorAvatar ||
              `https://ui-avatars.com/api/?name=${author}&background=random`
            }
            alt={author}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${author}&background=random`;
            }}
            className="w-12 h-12 rounded-full object-cover hover:opacity-90 transition-opacity"
          />
        </button>

        <div>
          <button
            onClick={() => userId && navigate(`/users/${userId}`)}
            className="font-semibold text-bg-secondary-dark dark:text-gray-100 hover:underline text-left"
          >
            {author}
          </button>

          {authorUsername && (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              @{authorUsername}
            </p>
          )}

          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{date}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{readingTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Actions (مخفية لو أنت صاحب البوست) ───────────────────────── */}
      {!isOwnProfile && (
        <div className="flex items-center gap-2 shrink-0">
          {/* زرار Follow */}
          <button
            onClick={handleFollowToggle}
            disabled={followLoading || initialLoading || !userId}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 disabled:opacity-60 ${
              isFollowing
                ? "text-text-light dark:text-text-dark bg-blue-50 border border-blue-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                : "text-white bg-primary hover:bg-text-light"
            }`}
          >
            {followLoading || initialLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isFollowing ? (
              <>
                <UserCheck className="w-4 h-4" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Follow
              </>
            )}
          </button>

          {/* زرار Message */}
          <button
            onClick={handleMessage}
            disabled={messageLoading || !userId}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 flex items-center gap-2 disabled:opacity-60"
          >
            {messageLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <MessageCircle className="w-4 h-4" />
                Message
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
