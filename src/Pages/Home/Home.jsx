import React, { useEffect, useState, useContext } from "react";
import Post from "../../Components/Post/Post";
import { posts } from "../../context/PostsData";
import { PopularTags } from "../../Components/PopularTags/PopularTags";
import { RecommendedTopics } from "../../Components/RecommendedTopics/RecommendedTopics";
import { SuggestedToFollow } from "../../Components/SuggestedToFollow/SuggestedToFollow";
import { Messages } from "../../Components/Messages/Messages";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const Home = () => {
  const [openReactionId, setOpenReactionId] = useState(null);
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);
  const [searchParams] = useSearchParams();

  // 1. هندلة التوكين اللي جاي من Social Login
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("userToken", token);
      setUserData(token);
      // بنشيل التوكين من اللينك عشان الشكل
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams, setUserData]);

  // 2. التأكد من حالة الحساب (Verified)
  useEffect(() => {
    async function checkStatus() {
      // بنجيب التوكين من المخزن مباشرةً لضمان الدقة
      const currentToken = localStorage.getItem("userToken");
      if (!currentToken) return;

      try {
        const { data } = await axios.get(
          `http://devhub.eu-north-1.elasticbeanstalk.com/api/v1/email/is-verified`,
          { headers: { Authorization: `Bearer ${currentToken}` } },
        );

        // لو الحساب مش متفعل نوديه لصفحة الـ OTP
        if (data.success && data.data.is_verified === false) {
          const savedEmail = localStorage.getItem("userEmail");
          navigate("/otp-verification", {
            state: { email: savedEmail },
            replace: true,
          });
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(
            "Unauthorized - Token invalid. Staying on page for debug.",
          );
          // لو حابة يخرج تلقائياً فكي الكومنت اللي تحت
          // localStorage.removeItem("userToken");
          // setUserData(null);
          // navigate("/login");
        }
      }
    }

    const timeoutId = setTimeout(checkStatus, 500);
    return () => clearTimeout(timeoutId);
  }, [userData, navigate]);

  return (
    <div className="dark:bg-bg-primary-dark flex">
      <div className="fixed bottom-4 right-4 z-50 lg:hidden">
        <Messages />
      </div>
      <div className="fixed bottom-0 left-2 z-50 w-[18%] mt-10 ml-2 hidden lg:block">
        <Messages />
      </div>

      <div className="flex mx-auto justify-center">
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
  );
};

export default Home;
