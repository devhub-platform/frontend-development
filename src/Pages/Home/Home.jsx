import React from "react";
import { useState } from "react";
import Post from "../../Components/Post/Post";
import { posts } from "../../context/PostsData";
import { PopularTags } from "../../Components/PopularTags/PopularTags";
import { RecommendedTopics } from "../../Components/RecommendedTopics/RecommendedTopics";
import { SuggestedToFollow } from "../../Components/SuggestedToFollow/SuggestedToFollow";
import { Messages } from "../../Components/Messages/Messages";

const Home = () => {
    const [openReactionId, setOpenReactionId] = useState(null);

  return (
    <>
      <div className="dark:bg-bg-primary-dark flex">
        {/* زر عائم للموبايل / تابلت (أيقونة فقط) */}
        <div className="fixed bottom-4 right-4 z-50 lg:hidden">
          <Messages />
        </div>

        {/* Sidebar لسطح المكتب – الكود الأصلي كما هو */}
        <div className="fixed bottom-0 left-2 z-50 w-[18%] mt-10 ml-2 hidden lg:block">
          <Messages />
        </div>

        <div className="flex mx-auto justify-center">
          {/* Posts Section */}
          <div className="lg:w-[60%] lg:ml-15 my-5">
            <div className="flex flex-col items-center bg-white dark:bg-bg-secondary-dark rounded-lg shadow-md">
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

          <div className="w-[22%] my-10 hidden lg:block ml-8">
            <PopularTags />
            <SuggestedToFollow />
            <RecommendedTopics />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
