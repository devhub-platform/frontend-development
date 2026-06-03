import { Calendar, Clock, Check, Loader2 } from "lucide-react";
import { useState, useContext } from "react";
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
  const navigate = useNavigate();
  const { setSelectedConversationId } = useContext(UserContext);

  const token = localStorage.getItem("userToken");
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  // Follow / Unfollow
  const handleFollowToggle = async () => {
    if (followLoading || !userId) return;
    setFollowLoading(true);
    const url = isFollowing
      ? `/users/${userId}/unfollow`
      : `/users/${userId}/follow`;
    try {
      await axiosInstance.post(url, {}, { headers });
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Follow failed:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  // Message - فتح الشات مباشرة زي ما بيحصل في UsersProfile
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
      }
    } catch (err) {
      console.error("Message failed:", err);
    } finally {
      setMessageLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 py-6 border-b border-gray-200 dark:border-gray-700">
      {/* Avatar + info */}
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

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleFollowToggle}
          disabled={followLoading || !userId}
          className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 disabled:opacity-60 ${
            isFollowing
              ? "text-text-light dark:text-text-dark bg-blue-50 border border-blue-200 hover:bg-blue-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              : "text-white bg-primary hover:bg-text-light"
          }`}
        >
          {followLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isFollowing ? (
            <>
              <Check className="w-4 h-4" /> Following
            </>
          ) : (
            "Follow"
          )}
        </button>

        <button
          onClick={handleMessage}
          disabled={messageLoading || !userId}
          className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 flex items-center gap-2 disabled:opacity-60"
        >
          {messageLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Message"
          )}
        </button>
      </div>
    </div>
  );
}
