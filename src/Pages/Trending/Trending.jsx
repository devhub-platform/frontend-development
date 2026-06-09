import React, { useEffect, useState, useRef } from "react";
import Post from "../../Components/Post/Post";
import { Messages } from "../../Components/Messages/Messages";
import { PopularTags } from "../../Components/PopularTags/PopularTags";
import { SuggestedToFollow } from "../../Components/SuggestedToFollow/SuggestedToFollow";
import axiosInstance from "../../config/api";

/* ─────────────────────────────────────────────
   Tag Chips
───────────────────────────────────────────── */
const TagChips = ({ tags, active, onChange }) => (
  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
    {tags.map((t) => (
      <button
        key={t}
        onClick={() => onChange(t)}
        className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
          active === t
            ? "bg-primary text-white shadow-sm"
            : "bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        {t}
      </button>
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   Tech Trend Card
───────────────────────────────────────────── */
const CARD_GRADIENTS = [
  // البنفسجي والنيلي العميق (بديل للأول)
  "from-violet-700 via-indigo-700 to-purple-800",

  // الأزرق البحري العميق مع السيان الداكن (بديل للثاني)
  "from-blue-700 via-cyan-700 to-teal-800",

  // الأخضر الزمردي الغامق (بديل للثالث)
  "from-emerald-700 via-teal-700 to-cyan-800",

  // أزرق السماء الداكن والنيلي (بديل للرابع)
  "from-sky-700 via-blue-700 to-indigo-800",
];

const SOURCE_LABEL = {
  hackernews: { icon: "🔶", label: "HackerNews" },
  devto: { icon: "💻", label: "dev.to" },
};

const TechTrendCard = ({ item, index, onClick }) => {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const src = SOURCE_LABEL[item.source] || { icon: "🌐", label: item.source };

  return (
    <div
      onClick={() => onClick(item)}
      className={`cursor-pointer w-88 h-58 shrink-0 rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 select-none flex flex-col justify-between min-h-[180px]`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-white/20 rounded-full px-2.5 py-0.5">
            {src.icon} {src.label}
          </span>
          <span className="text-[10px] font-semibold bg-white/15 rounded-full px-2 py-0.5 capitalize">
            {item.topic}
          </span>
        </div>
        <p className="text-sm font-bold leading-snug line-clamp-3">
          {item.title}
        </p>
        {item.description && (
          <p className="text-xs text-white/65 mt-2 line-clamp-2">
            {item.description}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-[12px] text-white/80">
          <span className="font-semibold">
            ⬆ {item.stats?.toLocaleString()}
          </span>
          {item.tags?.slice(0, 1).map((t) => (
            <span key={t} className="bg-white/20 rounded-full px-2 py-1">
              #{t}
            </span>
          ))}
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-[12px] font-bold bg-white/95 text-gray-800 rounded-full px-3 py-2 hover:bg-white transition shrink-0"
        >
          VIEW MORE
        </a>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Horizontal Scroll Row with Arrows
───────────────────────────────────────────── */
const ScrollRow = ({ children, loading }) => {
  const ref = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [children]);

  const scroll = (dir) => {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Left arrow */}
      {canLeft && (
        <button
          onClick={() => scroll(-2)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          ‹
        </button>
      )}

      {/* Right arrow */}
      {canRight && (
        <button
          onClick={() => scroll(2)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          ›
        </button>
      )}

      {/* Scroll container – no scrollbar */}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto py-5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-88 h-58 shrink-0 rounded-2xl bg-gray-100 dark:bg-gray-700 animate-pulse"
              />
            ))
          : children}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Tech Detail Modal
───────────────────────────────────────────── */
const TechDetailModal = ({ techId, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/trending/tech/${techId}`);
        setDetail(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [techId]);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const src = detail
    ? SOURCE_LABEL[detail.source] || { icon: "🌐", label: detail.source }
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4 pb-4 sm:pb-0"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-bg-secondary-dark rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm"
        >
          ✕
        </button>

        {loading ? (
          <div className="space-y-3 animate-pulse pt-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl mt-4" />
          </div>
        ) : detail ? (
          <>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300 rounded-full px-3 py-1 mb-4">
              {src.icon} {src.label}
              {detail.topic && <> · {detail.topic}</>}
            </span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-snug mb-3 pr-6">
              {detail.title}
            </h2>
            {detail.summary && (
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {detail.summary}
              </p>
            )}
            {detail.why_trending && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4 mb-3">
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-1">
                  🔥 Why Trending
                </p>
                <p className="text-md text-amber-800 dark:text-amber-300 leading-relaxed">
                  {detail.why_trending}
                </p>
              </div>
            )}
            {detail.impact && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-xl p-4 mb-5">
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1">
                  💡 Impact
                </p>
                <p className="text-md text-blue-800 dark:text-blue-300 leading-relaxed">
                  {detail.impact}
                </p>
              </div>
            )}
            <div className="flex items-center justify-between pt-1">
              <div className="flex gap-2 flex-wrap">
                {detail.tags?.map((t) => (
                  <span
                    key={t}
                    className="text-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full px-2.5 py-0.5"
                  >
                    #{t}
                  </span>
                ))}
              </div>
              <a
                href={detail.url}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 ml-3 text-sm font-bold bg-primary hover:opacity-90 text-white rounded-full px-5 py-2 transition"
              >
                Open →
              </a>
            </div>
          </>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 text-center py-8">
            Could not load details.
          </p>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const Trending = () => {
  const [openReactionId, setOpenReactionId] = useState(null);

  const [postsList, setPostsList] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [readingLists, setReadingLists] = useState([]);
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState(new Set());

  const [techItems, setTechItems] = useState([]);
  const [techLoading, setTechLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("All");
  const [selectedTechId, setSelectedTechId] = useState(null);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;
      try {
        const { data } = await axiosInstance.get("/reading-lists/lists/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const allLists = data.data || [];
        setReadingLists(allLists);
        const ids = new Set();
        allLists.forEach((list) =>
          (list.posts || []).forEach((p) => ids.add(p.id)),
        );
        setBookmarkedPostIds(ids);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setPostsLoading(true);
      try {
        const token = localStorage.getItem("userToken");
        const { data } = await axiosInstance.get(
          `/trending/posts?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );
        const raw = data.data || [];
        const mapped = raw.map((p) => ({
          id: p.id,
          title: p.title,
          excerpt: p.excerpt || p.content?.slice(0, 150) || "",
          author: p.author?.name || "Unknown",
          avatar: p.author?.avatar_url || null,
          username: p.author?.username || "",
          date: p.created_at || "",
          readingTime: p.read_time || "",
          image: p.cover_image || p.image_url?.[0] || "",
          tags: Array.isArray(p.tags) ? p.tags : [],
          reactionsCount: p.reactions_count || 0,
          commentsCount: p.comments_count || 0,
          views: p.views || 0,
          trendingScore: p.trending_score || 0,
        }));
        setPostsList((prev) => (page === 1 ? mapped : [...prev, ...mapped]));
        setHasMore(page < (data.meta?.last_page || 1));
      } catch (err) {
        console.error(err);
      } finally {
        setPostsLoading(false);
      }
    })();
  }, [page]);

  useEffect(() => {
    (async () => {
      setTechLoading(true);
      try {
        const { data } = await axiosInstance.get("/trending/tech");
        setTechItems(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setTechLoading(false);
      }
    })();
  }, []);

  const techTopics = [
    "All",
    ...Array.from(
      new Set((techItems || []).map((i) => i.topic).filter(Boolean)),
    ),
  ];

  const filteredTech =
    activeTag === "All"
      ? techItems
      : techItems.filter((i) => i.topic === activeTag);

  return (
    <>
      {selectedTechId && (
        <TechDetailModal
          techId={selectedTechId}
          onClose={() => setSelectedTechId(null)}
        />
      )}

      <div className="dark:bg-bg-primary-dark min-h-screen">
        <div className="fixed bottom-4 right-4 z-40 lg:hidden">
          <Messages />
        </div>
        <div className="fixed bottom-0 left-2 z-40 w-[18%] mt-10 ml-2 hidden lg:block">
          <Messages />
        </div>

        {/* ══ TECH HERO STRIP ════════════════════ */}
        <div className="bg-white dark:bg-bg-secondary-dark border-b border-gray-100 dark:border-gray-800 px-2 py-5  mx-15 rounded-lg mt-4">
          <div className="max-w-8xl mx-auto space-y-3">
            <div className="flex items-center justify-between w-full">
              <div className="space-y-1 w-full m-5">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Trending 🔥
                </h1>
                <p className="text-md text-gray-400 dark:text-gray-500 mt-0.5">
                  Top Posts In Development Today
                </p>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                via HackerNews & dev.to
              </span>
            </div>

            {techTopics.length > 1 && (
              <TagChips
                tags={techTopics}
                active={activeTag}
                onChange={setActiveTag}
              />
            )}

            <ScrollRow loading={techLoading}>
              {filteredTech.length === 0 ? (
                <p className="text-sm text-gray-400 py-6 text-center w-full">
                  No tech trends for this topic.
                </p>
              ) : (
                filteredTech.map((item, idx) => (
                  <TechTrendCard
                    key={item.id}
                    item={item}
                    index={idx}
                    onClick={(i) => setSelectedTechId(i.id)}
                  />
                ))
              )}
            </ScrollRow>
          </div>
        </div>

        {/* ══ POSTS + SIDEBAR ════════════════════ */}
        <div className="mx-auto flex justify-center px-4 lg:px-6">
          <div className="w-full lg:w-[70%] lg:ml-12 my-6">
            <div className="flex flex-col bg-white dark:bg-bg-secondary-dark rounded-2xl shadow-sm overflow-hidden">
              {postsLoading && page === 1 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full p-5 border-b border-gray-100 dark:border-gray-800 animate-pulse"
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
                <div className="py-20 text-center text-gray-400 dark:text-gray-500">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="font-medium">No trending posts yet.</p>
                  <p className="text-sm mt-1">Check back soon!</p>
                </div>
              ) : (
                postsList.map((post) => (
                  <Post
                    key={post.id}
                    post={post}
                    isReactionOpen={openReactionId === post.id}
                    setOpenReactionId={setOpenReactionId}
                    readingLists={readingLists}
                    setReadingLists={setReadingLists}
                    initialIsBookmarked={bookmarkedPostIds.has(post.id)}
                    onBookmarkChange={(postId, added) => {
                      setBookmarkedPostIds((prev) => {
                        const next = new Set(prev);
                        added ? next.add(postId) : next.delete(postId);
                        return next;
                      });
                    }}
                  />
                ))
              )}

              {!postsLoading && hasMore && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="mx-auto my-6 px-8 py-2 rounded-full bg-primary hover:opacity-90 text-white text-sm font-semibold transition"
                >
                  Load More
                </button>
              )}

              {postsLoading && page > 1 && (
                <div className="my-6 flex items-center justify-center gap-2 text-sm text-gray-400">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Loading more posts…
                </div>
              )}
            </div>
          </div>

          <div className="w-[25%] my-6 hidden lg:block ml-8">
            <PopularTags />
            <SuggestedToFollow />
          </div>
        </div>
      </div>
    </>
  );
};

export default Trending;
