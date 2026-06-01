import React, { useEffect, useState, useContext } from "react";
import Post from "../../Components/Post/Post";
import { PopularTags } from "../../Components/PopularTags/PopularTags";
import { SuggestedToFollow } from "../../Components/SuggestedToFollow/SuggestedToFollow";
import { Messages } from "../../Components/Messages/Messages";
import axiosInstance from "../../config/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const Home = () => {
  const [openReactionId, setOpenReactionId] = useState(null);
  const [postsList, setPostsList] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);
  const [searchParams] = useSearchParams();

  // 1. هندلة التوكين اللي جاي من Social Login
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("userToken", token);
      setUserData(token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams, setUserData]);

  // 2. التأكد من حالة الحساب (Verified)
  useEffect(() => {
    async function checkStatus() {
      const currentToken = localStorage.getItem("userToken");
      if (!currentToken) return;
      try {
        const { data } = await axiosInstance.get("/email/is-verified", {
          headers: { Authorization: `Bearer ${currentToken}` },
        });
        if (data.success && data.data.is_verified === false) {
          const savedEmail = localStorage.getItem("userEmail");
          navigate("/otp-verification", {
            state: { email: savedEmail },
            replace: true,
          });
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(
            "Unauthorized - Token invalid. Staying on page for debug.",
          );
        }
      }
    }
    const timeoutId = setTimeout(checkStatus, 500);
    return () => clearTimeout(timeoutId);
  }, [userData, navigate]);

  // 3. جلب البوستات من الـ API
  useEffect(() => {
    const fetchPosts = async () => {
      setPostsLoading(true);
      try {
        const token = localStorage.getItem("userToken");
        const { data } = await axiosInstance.get(`/posts?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const raw = data.data || [];

        // تحويل شكل البيانات القادمة من الـ API لشكل يتوافق مع الـ Post component
        const mapped = raw.map((p) => ({
          id: p.id,
          title: p.title,
          excerpt: p.content?.slice(0, 150) || "",
          author: p.user?.name || "Unknown",
          avatar: p.user?.avatar_image || null,
          date: p.created_at || "",
          readingTime: p.read_time || "",
          image:
            p.image_url?.[0] ||
            p.cover_image ||
            "https://picsum.photos/640/480?random=" + p.id,
          tags: p.tags?.map((t) => t.name) || [],
          reactionsCount: Object.values(
            p.reaction?.reaction_with_count || {},
          ).reduce((a, b) => a + b, 0),
          commentsCount: p.reaction?.comments_count || 0,
          views: p.views || 0,
        }));

        setPostsList((prev) => (page === 1 ? mapped : [...prev, ...mapped]));
        // لو مفيش next page نوقف التحميل
        setHasMore(Boolean(data.links?.next));
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  return (
    <div className="dark:bg-bg-primary-dark flex">
      <div className="fixed bottom-4 right-4 z-50 lg:hidden">
        <Messages />
      </div>
      <div className="fixed bottom-0 left-2 z-50 w-[18%] mt-10 ml-2 hidden lg:block">
        <Messages />
      </div>

      <div className="flex mx-auto justify-center">
        <div className="lg:w-[70%] lg:ml-15 my-5">
          <div className="flex flex-col items-center bg-white dark:bg-bg-secondary-dark rounded-lg shadow-md">
            {postsLoading && page === 1 ? (
              // Skeleton loading للبوستات
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full p-5 border-b border-gray-200 dark:border-gray-700 animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                      </div>
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                    </div>
                    <div className="w-28 h-28 bg-gray-200 dark:bg-gray-700 rounded-xl shrink-0" />
                  </div>
                </div>
              ))
            ) : postsList.length === 0 ? (
              <div className="py-16 text-center text-gray-500 dark:text-gray-400">
                No posts found.
              </div>
            ) : (
              postsList.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  isReactionOpen={openReactionId === post.id}
                  setOpenReactionId={setOpenReactionId}
                />
              ))
            )}

            {/* زرار تحميل المزيد */}
            {!postsLoading && hasMore && (
              <button
                onClick={() => setPage((p) => p + 1)}
                className="my-6 px-8 py-2 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition"
              >
                Load More
              </button>
            )}
            {postsLoading && page > 1 && (
              <div className="my-6 flex items-center gap-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Loading...
              </div>
            )}
          </div>
        </div>

        <div className="w-[25%] my-10 hidden lg:block ml-8">
          <PopularTags />
          <SuggestedToFollow />
        </div>
      </div>
    </div>
  );
};

export default Home;
