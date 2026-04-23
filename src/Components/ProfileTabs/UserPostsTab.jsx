import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../Post/Post"
import axiosInstance from "../../config/api";
import { Edit3, Archive, Trash2 } from "lucide-react";

const UserPostsTab = ({ openReactionId, setOpenReactionId, author }) => {
  const { id } = useParams();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("userToken");
      try {
        const { data } = await axiosInstance.get(
          `/users/${id}/posts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // تحويل شكل البيانات (Mapping) لتتوافق مع الـ Post Component
        const formattedPosts = data.data.map((post) => ({
          id: post.id,
          title: post.title,
          excerpt: post.content,
          author: post.user.name,
          avatar: post.user.avatar_image,
          date: post.created_at,
          readingTime: post.read_time || "", 
          tags: post.tags.map((t) => t.name),
          image:
            post.image_url ||
            post.cover_image ||
            "https://placehold.co/600x400?text=No+Image",
          reactionsCount: post.reaction ? post.reaction.reaction_with_count.length : 0, // أو حسب مجموع الـ reactions عندك
          commentsCount: post.reaction ? post.reaction.comments_count : 0,
          views: post.views,
        }));

        setMyPosts(formattedPosts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center dark:text-white flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        <p>Loading {author} posts...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-2xl border border-gray-200 shadow-xl dark:border-bg-secondary-dark dark:bg-bg-secondary-dark">
      <h3 className="mb-4 font-semibold text-2xl dark:text-white pb-4 dark:border-gray-700">
        {author}'s Published Posts
      </h3>

      {myPosts.length > 0 ? (
        <div className="flex flex-col">
          {myPosts.map((post) => (
            <Post
              key={post.id}
              post={post}
              isReactionOpen={openReactionId === post.id}
              setOpenReactionId={setOpenReactionId}
            />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {author} haven't published any posts yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserPostsTab;
