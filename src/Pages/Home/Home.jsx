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
      <div className="flex dark:bg-bg-primary-dark relative">
        {/* زر عائم للموبايل / تابلت (أيقونة فقط) */}
        <div className="fixed bottom-4 right-4 z-50 lg:hidden">
          <Messages />
        </div>

        {/* Sidebar لسطح المكتب – الكود الأصلي كما هو */}
        <div className="w-[23%] mt-10 ml-3 hidden lg:block relative">
          <Messages />
        </div>

              {/* Posts Section */}
              <div className="lg:w-[50%] lg:mx-5 my-5 mx-auto">
                <div className="flex flex-col items-center bg-white dark:bg-bg-secondary-dark rounded-lg shadow-md">
                  {posts.map((post) => (
                    <Post key={post.id} post={post}
                          isReactionOpen={openReactionId === post.id}
                          setOpenReactionId={setOpenReactionId} />
                  ))}
                </div>
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
