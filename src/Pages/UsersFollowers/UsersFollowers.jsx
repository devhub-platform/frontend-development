import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { UserCheck, UserPlus, Loader2 } from "lucide-react";
import axiosInstance from "../../config/api";
import { useNavigate, useParams } from "react-router-dom";

export default function UserFollowers() {
  const { id } = useParams();
  const myId = parseInt(localStorage.getItem("aiChat_currentSessionId"));
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();
  const [followersList, setFollowersList] = useState([]);
  const [followingIds, setFollowingIds] = useState(new Set());

  const fetchData = async () => {
    const token = localStorage.getItem("userToken");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      setLoading(true);
      const userRes = await axiosInstance.get(`/users/${id}`, { headers });
      setUserName(userRes.data.data.name);
      const { data } = await axiosInstance.get(`/users/${id}/followers`, {
        headers,
      });

      // بناءً على الـ Response بتاعك: الداتا موجودة جوه data.following
      setFollowersList(data.followers || []);
    } catch (error) {
      console.error("Error fetching following data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyData = async () => {
      const token = localStorage.getItem("userToken");
      const headers = { Authorization: `Bearer ${token}` };
  
      try {
        setLoading(true);
  
        // تنفيذ الـ 2 API في نفس الوقت لسرعة التحميل
        const [resFollowers, resFollowing] = await Promise.all([
          axiosInstance.get("/followers/my-followers", { headers }),
          axiosInstance.get("/followers/my-following", { headers }),
        ]);
  
        // 1. تخزين قائمة المتابعين (الناس اللي متابعاني)
        setFollowersList(resFollowers.data.followers || []);
  
        // 2. استخراج الـ IDs من قائمة الـ Following وتخزينهم في Set للبحث السريع
        const ids = new Set(resFollowing.data.following?.map((user) => user.id));
        setFollowingIds(ids);
      } catch (error) {
        console.error("Error fetching followers data:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (id) fetchData();
    fetchMyData();
  }, [id]);

  const handleFollowToggle = async (user) => {
    setActionLoadingId(user.id);

    // فحص هل الـ ID بتاع اليوزر موجود في الـ Set بتاعتنا ولا لأ
    const isCurrentlyFollowing = followingIds.has(user.id);
    const url = isCurrentlyFollowing
      ? `/users/${user.id}/unfollow`
      : `/users/${user.id}/follow`;
    const token = localStorage.getItem("userToken");

    try {
      await axiosInstance.post(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // تحديث الـ Set محلياً فور نجاح الطلب
      setFollowingIds((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyFollowing) {
          newSet.delete(user.id); // إلغاء متابعة
        } else {
          newSet.add(user.id); // متابعة
        }
        return newSet;
      });
    } catch (error) {
      console.error("Action failed:", error);
      alert("Something went wrong, please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] relative flex flex-col items-center py-8 md:py-16 px-2 overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-150 h-150 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <Helmet>
        <title>DevHub | {userName} Followers</title>
      </Helmet>

      <div className="max-w-6xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
            {userName}{" "}
            <span className="text-text-light dark:text-text-dark italic">
              Followers
            </span>
          </h1>
          <p className="text-slate-400 font-medium max-w-md mx-auto">
            Exploring {followersList.length} connections of this user.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {followersList.map((user) => (
              <div
                key={user.id}
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
                    className="w-16 h-16 md:w-20 md:h-20 rounded-3xl object-cover border-2 border-transparent group-hover:border-primary/20 transition-all"
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

                {user.id !== myId && (
                  <button
                    disabled={actionLoadingId === user.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowToggle(user);
                    }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-[12px] font-black transition-all 
          ${
            actionLoadingId === user.id
              ? "bg-slate-200 dark:bg-slate-700 text-slate-500"
              : followingIds.has(user.id)
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-red-50 hover:text-red-500"
                : "bg-primary text-white shadow-lg shadow-primary/30"
          }`}
                  >
                    {actionLoadingId === user.id ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />{" "}
                        PROCESSING...
                      </>
                    ) : followingIds.has(user.id) ? (
                      <>
                        <UserCheck size={16} strokeWidth={3} /> UNFOLLOW
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} strokeWidth={3} /> FOLLOW
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}

            {followersList.length === 0 && (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-400 font-medium">No followers yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
