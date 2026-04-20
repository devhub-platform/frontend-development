import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Helmet from "react-helmet";
import { UserCheck, UserPlus, Sparkles, Loader2 } from "lucide-react";
import axiosInstance from "../../config/api";

export default function MyFollowers() {
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFollowing = async () => {
    const token = localStorage.getItem("userToken");
    try {
      const { data } = await axiosInstance.get("/followers/my-following", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowingList(data.Following || []); // Assuming the response has a list of users with an 'id' field
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
            My {" "}
            <span className="text-primary dark:text-text-dark italic">
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
                key={user.username || index}
                className="group flex items-center justify-between p-5 bg-white dark:bg-slate-900/40 backdrop-blur-sm rounded-xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-primary/40 dark:hover:border-primary transition-all duration-500 shadow-2xl shadow-slate-200 dark:shadow-slate-800/50 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      user.avatar_url ||
                      `https://ui-avatars.com/api/?name=${user.name}&background=random`
                    }
                    alt={user.name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-3xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 shadow-md"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-base md:text-lg">
                      {user.name}
                    </h4>
                    <p className="text-primary dark:text-text-dark text-[10px] md:text-xs font-black uppercase tracking-widest">
                      @{user.username}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleFollowToggle(user)}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl text-[12px] font-black transition-all bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                >
                  <UserCheck size={16} strokeWidth={3} /> UNFOLLOW
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

        {/* Cards Grid - 8 items now */}
        {/* <div className="grid md:grid-cols-2 gap-6">
          {developers.map((dev) => (
            <div
              key={dev.id}
              className="group flex items-center justify-between p-5 bg-white dark:bg-slate-900/40 backdrop-blur-sm rounded-xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-primary/40 dark:hover:border-primary transition-all duration-500 shadow-2xl shadow-slate-200 dark:shadow-slate-800/50 hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <img
                  src={dev.img}
                  alt={dev.name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-3xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 shadow-md"
                />
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base md:text-lg">
                    {dev.name}
                  </h4>
                  <p className="text-primary dark:text-text-dark text-[10px] md:text-xs font-black uppercase tracking-widest">
                    {dev.role}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleFollow(dev.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black transition-all ${
                  following.includes(dev.id)
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                    : "bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50"
                }`}
              >
                {following.includes(dev.id) ? (
                  <>
                    <UserCheck size={16} strokeWidth={3} /> FOLLOWING
                  </>
                ) : (
                  <>
                    <UserPlus size={16} strokeWidth={3} /> FOLLOW
                  </>
                )}
              </button>
            </div>
          ))}
        </div> */}

        {/* <div className="flex justify-center pt-8">
          <button
            onClick={() => navigate("/home")}
            className="group relative w-full max-w-sm h-16 bg-primary/95 dark:bg-primary/95 text-white font-black text-xl rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-2xl overflow-hidden cursor-pointer"
          >
            <span className="relative z-10 tracking-[0.2em]">LET'S START</span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0"></div>
          </button>
        </div> */}
      </div>
    </div>
  );
}
