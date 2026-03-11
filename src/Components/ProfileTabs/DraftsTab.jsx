import React from "react";
import Post from "../Post/Post";
import { posts } from "../../context/PostsData";

const DraftsTab = ({ title, openReactionId, setOpenReactionId }) => (
  <div className="p-6 bg-card rounded-2xl border border-gray-200 shadow-xl dark:border-bg-secondary-dark dark:bg-bg-secondary-dark">
    <h3 className="mb-2 font-semibold text-2xl dark:text-white">{title}</h3>
    <div className="flex flex-col items-center dark:bg-bg-secondary-dark rounded-xl dark:border-bg-secondary-dark">
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          isReactionOpen={openReactionId === post.id}
          setOpenReactionId={setOpenReactionId}
        />
      ))}
    </div>
  </div>
);

export default DraftsTab;
