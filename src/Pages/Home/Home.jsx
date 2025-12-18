import React from "react";
import Post from "../../Components/Post/Post";
import { PopularTags } from "../../Components/PopularTags/PopularTags";
import { RecommendedTopics } from "../../Components/RecommendedTopics/RecommendedTopics";
import { SuggestedToFollow } from "../../Components/SuggestedToFollow/SuggestedToFollow";
import { Messages } from "../../Components/Messages/Messages";

const Home = () => {
  return (
    <>
      <div className="flex dark:bg-bg-primary-dark relative">
        {/* زر عائم للموبايل / تابلت (أيقونة فقط) */}
        <div className="fixed bottom-4 right-4 z-50 lg:hidden">
          <Messages />
        </div>

        {/* Sidebar لسطح المكتب – الكود الأصلي كما هو */}
        <div className="w-[23%] mt-10 ml-3 hidden lg:block relative">
          <Messages />
        </div>

        <div className="flex flex-col justify-center items-center lg:w-[50%] mx-5 dark:bg-bg-secondary-dark my-15 rounded-lg dark:shadow-2xl dark:shadow-gray-500/20 shadow-sm bg-white mb-2 sm:w-full">
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
        </div>

        <div className="w-[22%] my-10 mr-3 hidden lg:block">
          <RecommendedTopics />
          <SuggestedToFollow />
          <PopularTags />
        </div>
      </div>
    </>
  );
};

export default Home;
