import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Helmet from "react-helmet";
import { UserCheck, UserPlus, Loader2, Sparkles } from "lucide-react";
import { getFollowSuggestions } from "../../services/LandingApi"; // نداء السيرفيس الموحدة
import axiosInstance from "../../config/api";
import toast from "react-hot-toast";

export default function Recommendations() {
  const [developers, setDevelopers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followLoadingId, setFollowLoadingId] = useState(null);
  const navigate = useNavigate();

  // جلب المطورين المقترحين ديناميكياً من الباك إند بناءً على الاهتمامات الـ Topics
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setLoading(true);
        const res = await getFollowSuggestions();
        setDevelopers(res?.suggested_users || []);
      } catch (err) {
        console.error("Error loading suggestions page:", err);
        toast.error("Failed to load suggested developers.");
      } finally {
        setLoading(false);
      }
    };
    loadSuggestions();
  }, []);

  const toggleFollow = async (userId) => {
    if (followLoadingId) return;
    const token = localStorage.getItem("userToken");
    const isFollowing = following.includes(userId);

    setFollowLoadingId(userId);
    try {
      if (isFollowing) {
        await axiosInstance.post(
          `/users/${userId}/unfollow`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setFollowing((prev) => prev.filter((id) => id !== userId));
        toast.success("Unfollowed");
      } else {
        await axiosInstance.post(
          `/users/${userId}/follow`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setFollowing((prev) => [...prev, userId]);
        toast.success("Followed! 🎉");
      }
    } catch (err) {
      console.error("Follow error:", err);
      toast.error("Action failed.");
    } finally {
      setFollowLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f172a] relative flex flex-col items-center justify-center">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-150 h-150 bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-150 h-150 bg-primary/10 rounded-full blur-[120px] -z-10" />

        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Finding your tech match...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] relative flex flex-col items-center py-8 md:py-16 px-4 overflow-x-hidden font-sans transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-150 h-150 bg-primary/10 rounded-full blur-[120px] -z-10" />

      <Helmet>
        <title>DevHub | Connect</title>
      </Helmet>

      <div className="max-w-5xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            Connect with{" "}
            <span className="text-primary dark:text-text-dark italic">
              Pros
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium max-w-md mx-auto leading-relaxed">
            Build your network by following top industry experts based on your
            tech topics.
          </p>
        </div>

        {/* 🔴 ريندر الكروت الحقيقية للمطورين المقترحين من السيرفر بالملّي */}
        {developers.length === 0 ? (
          <div className="text-center text-slate-400 dark:text-slate-500 py-12 font-bold bg-slate-50/50 dark:bg-slate-900/20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            No suggestions available right now. You can start exploring straight
            away!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {developers.map((dev) => {
              const isFollowing = following.includes(dev.id);
              const isCardLoading = followLoadingId === dev.id;

              return (
                <div
                  key={dev.id}
                  className="group flex items-center justify-between p-5 bg-white dark:bg-slate-900/40 backdrop-blur-sm rounded-xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-primary/40 dark:hover:border-primary transition-all duration-500 shadow-2xl shadow-slate-200 dark:shadow-slate-800/50 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={
                        dev.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(dev.name)}&background=random`
                      }
                      alt={dev.name}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-3xl object-cover shadow-md shrink-0 border border-slate-100 dark:border-slate-800"
                    />
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-base md:text-lg truncate">
                        {dev.name}
                      </h4>
                      <p className="text-primary dark:text-text-dark text-[10px] md:text-xs font-black uppercase tracking-widest truncate mt-0.5">
                        {dev.bio || `@${dev.username}`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollow(dev.id)}
                    disabled={isCardLoading}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black transition-all shrink-0 cursor-pointer ${
                      isFollowing
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-neutral-700"
                        : "bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50"
                    }`}
                  >
                    {isCardLoading ? (
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isFollowing ? (
                      <>
                        <UserCheck size={14} strokeWidth={3} /> FOLLOWING
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} strokeWidth={3} /> FOLLOW
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* زر النقل النهائي الشغال بسلاسة للـ Home الحقيقية للمنصة */}
        <div className="flex justify-center pt-8">
          <button
            onClick={() => navigate("/home")}
            className="group relative w-full max-w-sm h-16 bg-primary text-white font-black text-xl rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-2xl overflow-hidden cursor-pointer flex items-center justify-center tracking-[0.2em]"
          >
            <span className="relative z-10">LET'S START</span>
            <div className="absolute inset-0 bg-primary-dark translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
