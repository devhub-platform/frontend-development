import React, { useState, useEffect } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import axiosInstance from "../../config/api"; // تأكدي من المسار

const ReadingListTab = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyLists = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const { data } = await axiosInstance.get("/reading-lists/lists/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // بناءً على الـ Response اللي بعتيه، الداتا موجودة جوه data.data
        setCollections(data.data || []);
      } catch (error) {
        console.error("Error fetching reading lists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyLists();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-2xl border border-gray-200 shadow-xl dark:border-bg-secondary-dark dark:bg-bg-secondary-dark">
      <h3 className="mb-6 font-semibold text-2xl dark:text-white">
        Your Reading Lists
      </h3>

      {collections.length > 0 ? (
        <div className="space-y-4">
          {collections.map((collection) => (
            <article
              key={collection.id}
              className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-50 dark:border-0 cursor-pointer dark:bg-gray-800/40"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold dark:text-white">
                      {collection.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                      {collection.description || ""}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      Created {collection.created_at} | {collection.post_count + " " + (collection.post_count === 1 ? "post" : "posts")}
                    </span>
                  </div>
                  <ChevronRight
                    size={24}
                    className="text-gray-400 group-hover:text-text-light dark:group-hover:text-text-dark transition-colors"
                  />
                </div>

                {/* الصور المصغرة للبوستات داخل الليست */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex space-x-1">
                    {collection.posts &&
                      collection.posts
                        .slice(0, 3)
                        .map((post, index) => (
                          <img
                            key={post.id || index}
                            src={post.cover_image}
                            className="w-38 h-30 rounded-lg object-cover border-2 border-white dark:border-gray-800 shadow-md"
                            alt="Post Cover Image"
                          />
                        ))}
                  </div>

                  {collection.post_count === 0 ? (
                    <div className="text-xs text-gray-400 italic ml-2">
                      Empty list
                    </div>
                  ) : collection.post_count <= 3 ?(
                    <div className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full px-3 py-1 ml-2">
                      {collection.post_count}{" "}
                      {collection.post_count === 1 ? "post" : "posts"}
                    </div>
                  ) : (
                    <div className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full px-3 py-1 ml-2">
                      +{collection.post_count - 3} more
                    </div>
                  )}
                </div>
              </div>
              <div className="h-1 bg-linear-to-r from-primary to-text-light dark:to-text-dark transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </article>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
          <p className="text-gray-500 dark:text-gray-400">
            You haven't created any reading lists yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReadingListTab;
