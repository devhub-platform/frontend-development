import React from "react";
import Post from "../Post/Post";
import { posts } from "../../context/PostsData";

const PostsTab = ({ openReactionId, setOpenReactionId }) => (
  <div className="p-6 bg-card rounded-2xl border border-gray-200 shadow-xl dark:border-bg-secondary-dark dark:bg-bg-secondary-dark">
    <h3 className="mb-4 font-semibold text-2xl dark:text-white">
      Your Published Posts Appear Here
    </h3>
    {posts.map((post) => (
      <Post
        key={post.id}
        post={post}
        isReactionOpen={openReactionId === post.id}
        setOpenReactionId={setOpenReactionId}
      />
    ))}
  </div>
);

export default PostsTab;
