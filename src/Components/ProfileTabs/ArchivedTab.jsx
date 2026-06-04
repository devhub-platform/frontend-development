import React, { useEffect, useState } from "react";
import Post from "../Post/Post";
import axiosInstance from "../../config/api";
import { RotateCcw, Trash2 } from "lucide-react";

const ArchivedTab = ({ openReactionId, setOpenReactionId }) => {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readingLists, setReadingLists] = useState([]);
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState(new Set());

  const getAuthHeaders = () => {
    const token = localStorage.getItem("userToken");
    return { Authorization: `Bearer ${token}`, Accept: "application/json" };
  };

  const handleRestore = async (postId) => {
    try {
      await axiosInstance.post(
        `/posts/${postId}/restore`,
        {},
        { headers: getAuthHeaders() },
      );
      setMyPosts((prev) => prev.filter((post) => post.id !== postId));
      alert("Post restored successfully!");
    } catch (error) {
      console.error("Error restoring post:", error);
      alert("Failed to restore the post. Please try again.");
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("This will delete the post permanently. Are you sure?"))
      return;
    try {
      await axiosInstance.delete(`/posts/${postId}/force`, {
        headers: getAuthHeaders(),
      });
      setMyPosts((prev) => prev.filter((post) => post.id !== postId));
      alert("Post deleted permanently!");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the post. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, listsRes] = await Promise.all([
          axiosInstance.get("/posts/archives", { headers: getAuthHeaders() }),
          axiosInstance.get("/reading-lists/lists/posts", {
            headers: getAuthHeaders(),
          }),
        ]);

        const formattedPosts = postsRes.data.data.map((post) => ({
          id: post.id,
          title: post.title,
          excerpt: post.content,
          author: post.user.name,
          avatar: post.user.avatar_image,
          date: post.created_at,
          readingTime: post.read_time || "",
          tags: post.tags ? post.tags.map((t) => t.name) : [],
          image:
          post.cover_image ||
            post.image_url?.[0] ||
            "https://placehold.co/600x400?text=No+Image",
          reactionsCount: Object.values(
            post.reaction?.reaction_with_count || {},
          ).reduce((a, b) => a + b, 0),
          commentsCount: post.reaction?.comments_count || 0,
          views: post.views || 0,
        }));

        const allLists = listsRes.data.data || [];
        const ids = new Set();
        allLists.forEach((list) =>
          (list.posts || []).forEach((p) => ids.add(p.id)),
        );

        setMyPosts(formattedPosts);
        setReadingLists(allLists);
        setBookmarkedPostIds(ids);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center dark:text-white flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        <p>Loading archived posts...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-2xl border border-gray-200 shadow-xl dark:border-bg-secondary-dark dark:bg-bg-secondary-dark">
      <h3 className="mb-4 font-semibold text-2xl dark:text-white pb-4 dark:border-gray-700">
        Your Archived Posts
      </h3>
      {myPosts.length > 0 ? (
        <div className="flex flex-col">
          {myPosts.map((post) => (
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
              menuOptions={[
                {
                  label: "Restore",
                  icon: <RotateCcw size={16} />,
                  onClick: (id) => handleRestore(id),
                },
                {
                  label: "Delete",
                  icon: <Trash2 size={16} />,
                  variant: "danger",
                  onClick: (id) => handleDelete(id),
                },
              ]}
            />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            You haven't archived any posts yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default ArchivedTab;
