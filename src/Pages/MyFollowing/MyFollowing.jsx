import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Helmet from "react-helmet";
import { UserCheck, UserPlus, Sparkles, Loader2 } from "lucide-react";
import axiosInstance from "../../config/api";

export default function MyFollowing() {
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchFollowing = async () => {
    const token = localStorage.getItem("userToken");
    try {
      const { data } = await axiosInstance.get("/followers/my-following", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowingList(data.following || []); // Assuming the response has a list of users with an 'id' field
    } catch (error) {
      console.error("Failed to fetch following:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowing();
  }, []);


  const handleFollowToggle = async (user) => {
    setActionLoadingId(user.id);
    const isCurrentFollowing = true;
    const url = isCurrentFollowing ? `/users/${user.id}/unfollow` : `/users/${user.id}/follow`;
    try {
      const token = localStorage.getItem("userToken");
      await axiosInstance.post(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowingList((prev) =>
        isCurrentFollowing
          ? prev.filter((u) => u.id !== user.id)
          : [...prev, user]
      );
    } catch (error) {
      console.error("Failed to toggle follow:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] relative flex flex-col items-center py-8 md:py-16  px-2 overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-150 h-150 bg-primary/10 rounded-full blur-[120px] -z-10" />

      <Helmet>
        <title>DevHub | My Following</title>
      </Helmet>

      <div className="max-w-6xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
            My{" "}
            <span className="text-text-light dark:text-text-dark italic">
              Network
            </span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-medium max-w-md mx-auto">
            You are following {followingList.length} professional developers.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {followingList.map((user, index) => (
              <div
                key={user.id || index}
                className="group flex items-center justify-between p-5 bg-white dark:bg-slate-900/40 backdrop-blur-sm rounded-xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-primary/40 dark:hover:border-primary transition-all duration-500 shadow-2xl shadow-slate-200 dark:shadow-slate-800/50 hover:-translate-y-1
                cursor-pointer"
                onClick={() => navigate(`/users/${user.id}`)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      user.avatar_url ||
                      `https://ui-avatars.com/api/?name=${user.name}&background=random`
                    }
                    alt={user.name}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=random`;
                    }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-3xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 shadow-md"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-base md:text-lg">
                      {user.name}
                    </h4>
                    <p className="text-text-light dark:text-text-dark text-[10px] md:text-xs font-black uppercase tracking-widest">
                      @{user.username}
                    </p>
                  </div>
                </div>

                <button
                  disabled={actionLoadingId === user.id} // نمنع الضغط أثناء التحميل
                  onClick={() => handleFollowToggle(user)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-[12px] font-black transition-all 
                    ${
                      actionLoadingId === user.id
                        ? "bg-slate-200 dark:bg-slate-700 cursor-not-allowed opacity-70"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    }`}
                >
                  {actionLoadingId === user.id ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      <UserCheck size={16} strokeWidth={3} />
                      UNFOLLOW
                    </>
                  )}
                </button>
              </div>
            ))}

            {!loading && followingList.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-400">
                You are not following anyone yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
