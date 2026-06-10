import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Hash,
  User,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const APP_ID = "FJCFFL2FHI";
const SEARCH_KEY = "01ef14143d76b377cdab53aa28708479";

async function searchIndex(indexName, query, hitsPerPage = 5) {
  const res = await fetch(
    `https://${APP_ID}-dsn.algolia.net/1/indexes/${indexName}/query`,
    {
      method: "POST",
      headers: {
        "X-Algolia-Application-Id": APP_ID,
        "X-Algolia-API-Key": SEARCH_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, hitsPerPage }),
    },
  );
  const data = await res.json();
  return data.hits ?? [];
}

const RECENT_KEY = "devhub_recent_searches";
const MAX_RECENT = 5;
const TRENDING_TAGS = [
  "AI & ML",
  "Web Development",
  "Productivity",
  "Design",
  "Technology",
];

function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveRecentSearch(query) {
  if (!query.trim()) return;
  const prev = getRecentSearches().filter((q) => q !== query);
  localStorage.setItem(
    RECENT_KEY,
    JSON.stringify([query, ...prev].slice(0, MAX_RECENT)),
  );
}
function clearRecentSearches() {
  localStorage.removeItem(RECENT_KEY);
}

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [results, setResults] = useState({ posts: [], tags: [], users: [] });
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults({ posts: [], tags: [], users: [] });
      setActiveTab("all");
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (!isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) {
      setResults({ posts: [], tags: [], users: [] });
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [posts, tags, users] = await Promise.all([
        searchIndex("posts", q),
        searchIndex("tags", q),
        searchIndex("users", q),
      ]);
      setResults({ posts, tags, users });
    } catch (err) {
      console.error("Algolia search error:", err);
      setResults({ posts: [], tags: [], users: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  const handleSelectQuery = (q) => {
    setQuery(q);
    saveRecentSearch(q);
    setRecentSearches(getRecentSearches());
    doSearch(q);
  };

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  // navigate داخل الـ BrowserRouter مع الـ basename تلقائياً
  const goTo = (path) => {
    saveRecentSearch(query);
    onClose();
    navigate(path);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    goTo(`/search?q=${encodeURIComponent(query.trim())}&tab=all`);
  };

  const hasResults =
    results.posts.length > 0 ||
    results.tags.length > 0 ||
    results.users.length > 0;
  const totalAll =
    results.posts.length + results.tags.length + results.users.length;

  const filteredPosts =
    activeTab === "all" || activeTab === "posts" ? results.posts : [];
  const filteredTags =
    activeTab === "all" || activeTab === "tags" ? results.tags : [];
  const filteredUsers =
    activeTab === "all" || activeTab === "users" ? results.users : [];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-16 px-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700"
        >
          <Search
            size={20}
            className="text-gray-400 shrink-0"
            strokeWidth={2}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search articles, authors, tags..."
            className="flex-1 bg-transparent text-[#0F172A] dark:text-gray-100 text-base outline-none placeholder-gray-400"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </form>

        {/* Tabs */}
        {query.trim() && hasResults && (
          <div className="flex items-center gap-1 px-4 pt-2 pb-1 border-b border-gray-100 dark:border-gray-700">
            {[
              { key: "all", label: `All (${totalAll})` },
              { key: "posts", label: `Posts (${results.posts.length})` },
              { key: "tags", label: `Tags (${results.tags.length})` },
              { key: "users", label: `People (${results.users.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                  activeTab === tab.key
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {/* Empty state */}
          {!query.trim() && (
            <div className="px-4 py-4 space-y-5">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Clock size={13} /> Recent Searches
                    </span>
                    <button
                      onClick={handleClearRecent}
                      className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {recentSearches.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSelectQuery(q)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-[#0F172A] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full"
                      >
                        <Clock size={14} className="text-gray-400 shrink-0" />
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <TrendingUp
                    size={13}
                    className="text-gray-500 dark:text-gray-400"
                  />
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Trending Searches
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleSelectQuery(tag)}
                      className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-[#0F172A] dark:text-gray-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Quick Links
                </p>
                <div className="flex flex-col gap-0.5">
                  {[
                    {
                      label: "Trending Articles",
                      icon: TrendingUp,
                      to: "/trending",
                    },
                    { label: "Q&A", icon: ArrowRight, to: "/qa" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={onClose}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#0F172A] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <item.icon size={14} className="text-blue-500 shrink-0" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-2 pb-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
                  Ctrl
                </kbd>
                {" + "}
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
                  K
                </kbd>
                {" to open search anytime"}
              </p>
            </div>
          )}

          {/* Results */}
          {query.trim() && !loading && (
            <div className="py-2">
              {!hasResults ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">
                  No results for &ldquo;<strong>{query}</strong>&rdquo;
                </p>
              ) : (
                <>
                  {/* Posts */}
                  {filteredPosts.length > 0 && (
                    <section className="mb-1">
                      {activeTab === "all" && (
                        <p className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                          <FileText size={12} /> Posts
                        </p>
                      )}
                      {filteredPosts.map((post) => (
                        <Link
                          key={post.objectID}
                          to={`/post/${post.objectID}`}
                          onClick={() => {
                            saveRecentSearch(query);
                            onClose();
                          }}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                        >
                          <FileText
                            size={16}
                            className="text-gray-400 shrink-0 mt-0.5"
                            strokeWidth={1.5}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#0F172A] dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {post.title}
                            </p>
                            {post.content && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
                                {post.content
                                  .replace(/[#*`>\[\]]/g, "")
                                  .slice(0, 80)}
                                ...
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                      {activeTab === "all" && (
                        <button
                          onClick={() =>
                            goTo(
                              `/search?q=${encodeURIComponent(query)}&tab=posts`,
                            )
                          }
                          className="flex items-center gap-1 px-4 py-2 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 font-medium"
                        >
                          See all post results <ArrowRight size={12} />
                        </button>
                      )}
                    </section>
                  )}

                  {/* Tags */}
                  {filteredTags.length > 0 && (
                    <section className="mb-1">
                      {activeTab === "all" && (
                        <p className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                          <Hash size={12} /> Tags
                        </p>
                      )}
                      {filteredTags.map((tag) => {
                        const tagName =
                          typeof tag.name === "string"
                            ? tag.name
                                .replace(/[\[\]"]/g, "")
                                .split(",")[0]
                                .trim()
                            : tag.name;
                        return (
                          <Link
                            key={tag.objectID}
                            to={`/tag/${tagName}`}
                            onClick={() => {
                              saveRecentSearch(query);
                              onClose();
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                          >
                            <Hash
                              size={15}
                              className="text-blue-400 shrink-0"
                              strokeWidth={2}
                            />
                            <span className="text-sm text-[#0F172A] dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {tagName}
                            </span>
                            {tag.posts_count != null && (
                              <span className="ml-auto text-xs text-gray-400">
                                {tag.posts_count} posts
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </section>
                  )}

                  {/* Users */}
                  {filteredUsers.length > 0 && (
                    <section>
                      {activeTab === "all" && (
                        <p className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                          <User size={12} /> People
                        </p>
                      )}
                      {filteredUsers.map((user) => (
                        <Link
                          key={user.objectID}
                          to={`/users/${user.id ?? user.objectID}`}
                          onClick={() => {
                            saveRecentSearch(query);
                            onClose();
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                        >
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                              <span className="text-blue-600 dark:text-blue-300 text-xs font-semibold">
                                {user.name?.charAt(0).toUpperCase() ?? "?"}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-[#0F172A] dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              @{user.username}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </section>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
