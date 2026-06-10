import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Search, Hash, User, FileText, ArrowLeft, Filter } from "lucide-react";

const APP_ID = "FJCFFL2FHI";
const SEARCH_KEY = "01ef14143d76b377cdab53aa28708479";

async function searchIndex(indexName, query, hitsPerPage = 20, page = 0) {
  const res = await fetch(
    `https://${APP_ID}-dsn.algolia.net/1/indexes/${indexName}/query`,
    {
      method: "POST",
      headers: {
        "X-Algolia-Application-Id": APP_ID,
        "X-Algolia-API-Key": SEARCH_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, hitsPerPage, page }),
    },
  );
  const data = await res.json();
  return {
    hits: data.hits ?? [],
    nbHits: data.nbHits ?? 0,
    nbPages: data.nbPages ?? 1,
  };
}

const TABS = [
  { key: "all", label: "All", icon: Search },
  { key: "posts", label: "Posts", icon: FileText },
  { key: "tags", label: "Tags", icon: Hash },
  { key: "users", label: "People", icon: User },
];

export default function SearchResult() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";
  const tab = searchParams.get("tab") || "all";

  const [inputVal, setInputVal] = useState(query);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ posts: [], tags: [], users: [] });
  const [counts, setCounts] = useState({ posts: 0, tags: 0, users: 0 });
  const [page, setPage] = useState(0);
  const [nbPages, setNbPages] = useState(1);

  const doSearch = useCallback(async (q, t, p = 0) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      if (t === "all") {
        const [posts, tags, users] = await Promise.all([
          searchIndex("posts", q, 6, p),
          searchIndex("tags", q, 6, p),
          searchIndex("users", q, 6, p),
        ]);
        setResults({ posts: posts.hits, tags: tags.hits, users: users.hits });
        setCounts({
          posts: posts.nbHits,
          tags: tags.nbHits,
          users: users.nbHits,
        });
        setNbPages(1);
      } else {
        const res = await searchIndex(t, q, 15, p);
        setResults({ posts: [], tags: [], users: [], [t]: res.hits });
        setNbPages(res.nbPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setInputVal(query);
    setPage(0);
    doSearch(query, tab, 0);
  }, [query, tab]);

  useEffect(() => {
    if (page > 0) doSearch(query, tab, page);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setSearchParams({ q: inputVal.trim(), tab });
  };

  const setTab = (t) => setSearchParams({ q: query, tab: t });

  const totalAll = counts.posts + counts.tags + counts.users;

  const currentHits =
    tab === "posts"
      ? results.posts
      : tab === "tags"
        ? results.tags
        : tab === "users"
          ? results.users
          : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Back + Search bar */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
          >
            <ArrowLeft size={18} />
          </button>
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 shadow-sm focus-within:border-blue-400 transition-colors"
          >
            <Search
              size={18}
              className="text-gray-400 shrink-0"
              strokeWidth={2}
            />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search articles, authors, tags..."
              className="flex-1 bg-transparent text-[#0F172A] dark:text-gray-100 text-sm outline-none placeholder-gray-400"
            />
            {inputVal && (
              <button
                type="submit"
                className="text-xs font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 shrink-0"
              >
                Search
              </button>
            )}
          </form>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-2xl p-1 shadow-sm border border-gray-100 dark:border-gray-800 mb-6 overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon }) => {
            const count = key === "all" ? totalAll : (counts[key] ?? 0);
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-150 flex-1 justify-center ${
                  tab === key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Icon size={14} />
                {label}
                {query && count > 0 && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      tab === key
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Query label */}
        {query && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {loading ? "Searching..." : `Results for `}
            {!loading && (
              <strong className="text-[#0F172A] dark:text-gray-100">
                &ldquo;{query}&rdquo;
              </strong>
            )}
          </p>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 animate-pulse"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* All tab */}
        {!loading && tab === "all" && (
          <div className="space-y-6">
            {totalAll === 0 && query && (
              <div className="text-center py-16">
                <Search
                  size={40}
                  className="mx-auto text-gray-300 dark:text-gray-600 mb-3"
                  strokeWidth={1}
                />
                <p className="text-gray-500 dark:text-gray-400">
                  No results for &ldquo;<strong>{query}</strong>&rdquo;
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Try different keywords
                </p>
              </div>
            )}

            {results.posts.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                    <FileText size={13} /> Posts
                  </h2>
                  {counts.posts > results.posts.length && (
                    <button
                      onClick={() => setTab("posts")}
                      className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 font-medium"
                    >
                      See all {counts.posts} →
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {results.posts.map((post) => (
                    <PostCard key={post.objectID} post={post} />
                  ))}
                </div>
              </section>
            )}

            {results.tags.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                    <Hash size={13} /> Tags
                  </h2>
                  {counts.tags > results.tags.length && (
                    <button
                      onClick={() => setTab("tags")}
                      className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 font-medium"
                    >
                      See all {counts.tags} →
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.tags.map((tag) => (
                    <TagCard key={tag.objectID} tag={tag} />
                  ))}
                </div>
              </section>
            )}

            {results.users.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                    <User size={13} /> People
                  </h2>
                  {counts.users > results.users.length && (
                    <button
                      onClick={() => setTab("users")}
                      className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 font-medium"
                    >
                      See all {counts.users} →
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {results.users.map((user) => (
                    <UserCard key={user.objectID} user={user} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Single tab results */}
        {!loading && tab !== "all" && currentHits && (
          <div>
            {currentHits.length === 0 && query && (
              <div className="text-center py-16">
                <Search
                  size={40}
                  className="mx-auto text-gray-300 dark:text-gray-600 mb-3"
                  strokeWidth={1}
                />
                <p className="text-gray-500 dark:text-gray-400">
                  No {tab} found for &ldquo;<strong>{query}</strong>&rdquo;
                </p>
              </div>
            )}

            {tab === "posts" && (
              <div className="space-y-2">
                {results.posts.map((post) => (
                  <PostCard key={post.objectID} post={post} />
                ))}
              </div>
            )}
            {tab === "tags" && (
              <div className="flex flex-wrap gap-2">
                {results.tags.map((tag) => (
                  <TagCard key={tag.objectID} tag={tag} />
                ))}
              </div>
            )}
            {tab === "users" && (
              <div className="space-y-2">
                {results.users.map((user) => (
                  <UserCard key={user.objectID} user={user} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {nbPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-[#0F172A] dark:text-gray-200"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page {page + 1} of {nbPages}
                </span>
                <button
                  disabled={page >= nbPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-[#0F172A] dark:text-gray-200"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PostCard({ post }) {
  return (
    <Link
      to={`/post/${post.objectID}`}
      className="flex items-start gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all group"
    >
      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5">
        <FileText
          size={15}
          className="text-blue-500 dark:text-blue-400"
          strokeWidth={1.5}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#0F172A] dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
          {post.title}
        </p>
        {post.content && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {post.content.replace(/[#*`>\[\]]/g, "").slice(0, 120)}...
          </p>
        )}
      </div>
    </Link>
  );
}

function TagCard({ tag }) {
  const name =
    typeof tag.name === "string"
      ? tag.name
          .replace(/[\[\]"]/g, "")
          .split(",")[0]
          .trim()
      : tag.name;
  return (
    <Link
      to={`/tag/${name}`}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-[#0F172A] dark:text-gray-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
    >
      <Hash size={13} className="text-blue-400" strokeWidth={2} />
      {name}
      {tag.posts_count != null && (
        <span className="text-xs text-gray-400 ml-1">{tag.posts_count}</span>
      )}
    </Link>
  );
}

function UserCard({ user }) {
  return (
    <Link
      to={`/users/${user.id ?? user.objectID}`}
      className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all group"
    >
      {user.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
          <span className="text-blue-600 dark:text-blue-300 text-sm font-semibold">
            {user.name?.charAt(0).toUpperCase() ?? "?"}
          </span>
        </div>
      )}
      <div>
        <p className="text-sm font-semibold text-[#0F172A] dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {user.name}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          @{user.username}
        </p>
      </div>
      {user.posts?.length > 0 && (
        <span className="ml-auto text-xs text-gray-400">
          {user.posts.length} posts
        </span>
      )}
    </Link>
  );
}
