import React, { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getFollowSuggestions } from "../../services/LandingApi"; // 🔴 ربط السيرفيس الموحدة هنا
import axiosInstance from "../../config/api";
import toast from "react-hot-toast";

export function SuggestedToFollow() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingIds, setFollowingIds] = useState(new Set());
  const [loadingIds, setLoadingIds] = useState(new Set());
  const navigate = useNavigate();

  // 🔴 استخدام دالة الـ API الرسمية النظيفة
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const data = await getFollowSuggestions();
        setUsers((data.suggested_users || []).slice(0, 4));
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  const handleFollow = async (userId) => {
    if (loadingIds.has(userId)) return;
    const token = localStorage.getItem("userToken");
    const isFollowing = followingIds.has(userId);

    setLoadingIds((prev) => new Set(prev).add(userId));
    try {
      if (isFollowing) {
        await axiosInstance.post(
          `/users/${userId}/unfollow`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setFollowingIds((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
        toast.success("Unfollowed successfully");
      } else {
        await axiosInstance.post(
          `/users/${userId}/follow`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setFollowingIds((prev) => new Set(prev).add(userId));
        toast.success("Followed successfully! 🎉");
      }
    } catch (error) {
      console.error("Follow action failed:", error);
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  return (
    <div className="bg-white rounded-md p-5 border border-gray-200 shadow-sm mb-5 dark:bg-bg-secondary-dark dark:border-gray-900 dark:shadow-gray-700/30">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="w-4 h-4 text-text-light dark:text-text-dark" />
        <h2 className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-tight">
          Suggested to Follow
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                  <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-36" />
                </div>
                <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
            ))
          : users.map((user) => {
              const isFollowing = followingIds.has(user.id);
              const isLoading = loadingIds.has(user.id);
              return (
                <div key={user.id} className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/frontend-development/users/${user.id}`)}
                    className="shrink-0 cursor-pointer"
                  >
                    <img
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                      }
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => navigate(`/frontend-development/users/${user.id}`)}
                      className="text-left w-full cursor-pointer group"
                    >
                      <h3 className="text-gray-900 text-sm font-bold truncate dark:text-gray-100 group-hover:underline">
                        {user.name}
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-1 dark:text-gray-400">
                        {user.bio || `@${user.username}`}
                      </p>
                    </button>
                  </div>

                  <button
                    onClick={() => handleFollow(user.id)}
                    disabled={isLoading}
                    className={`text-xs px-3 h-7 rounded-full shrink-0 transition-all font-bold cursor-pointer flex items-center justify-center disabled:opacity-60 ${
                      isFollowing
                        ? "bg-slate-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 border border-slate-200 dark:border-neutral-700"
                        : "bg-primary text-white hover:opacity-90 shadow-sm"
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isFollowing ? (
                      "Following"
                    ) : (
                      "Follow"
                    )}
                  </button>
                </div>
              );
            })}
      </div>
    </div>
  );
}