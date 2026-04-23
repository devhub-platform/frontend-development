/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Linkedin,
  Github,
  Ban,
  Calendar,
  BookOpen,
  MapPin,
  Loader2,
} from "lucide-react";
import { Messages } from "../../Components/Messages/Messages";
import { UserContext } from "../../context/UserContext";
import UserPostsTab from "../../Components/ProfileTabs/UserPostsTab";
import UserQATab from "../../Components/ProfileTabs/UserQATab";
import { FaUserGraduate } from "react-icons/fa";
import { SiOrcid } from "react-icons/si";
import Helmet from "react-helmet";
import axiosInstance from "../../config/api";

const UsersProfile = () => {
  const { id } = useParams(); // جلب المعرف من الرابط /users/4
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    skills: [],
    education: "",
    location: "",
    joined: "",
    joined_at: "",
    social_links: {},
    number_of_posts_published: 0,
    number_of_followers: 0,
    number_of_users_followed: 0,
    number_of_views_in_his_posts: 0,
  });

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [openReactionId, setOpenReactionId] = useState(null);

  const socialMediaPlatforms = [
    { name: "linkedin", icon: Linkedin },
    { name: "github", icon: Github },
    { name: "scholar", icon: FaUserGraduate },
    { name: "orcid", icon: SiOrcid },
  ];

  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [postsList, setPostsList] = useState([]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        // نستخدم الـ id الديناميكي من الـ useParams
        const response = await axiosInstance.get(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const user = response.data.data;

        setProfileData({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          bio: user.bio || "",
          skills: user.skills || [],
          education: user.education || "No education info",
          location: user.location || "Earth",
          joined: user.joined || "recent",
          joined_at: user.joined_at || "recent",
          social_links: user.social_links || {},
        });

        setProfileImage(user.avatar_url);
        setCoverImage(user.cover_image);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProfileData();
  }, [id, token]);

  useEffect(() => {
    const fetchFollowersAndFollowing = async () => {
      try {
        const responseFollowers = await axiosInstance.get(
          `/users/${id}/followers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );
        const responseFollowing = await axiosInstance.get(
          `/users/${id}/following`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );
        const responsePosts = await axiosInstance.get(`/users/${id}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        setPostsList(responsePosts.data.data || []);
        setFollowersList(responseFollowers.data.followers || []);
        setFollowingList(responseFollowing.data.following || []);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    if (id) fetchFollowersAndFollowing();
  }, [id, token]);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const response = await axiosInstance.get("/followers/my-following", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const following = response.data.following || [];
        // هل الـ ID بتاع البروفايل ده موجود في قائمة الناس اللي أنا متابعهم؟
        const status = following.some((u) => u.id === parseInt(id));
        setIsFollowing(status);
      } catch (error) {
        console.error("Error checking following status:", error);
      }
    };

    if (id && token) checkFollowingStatus();
  }, [id, token]);

  const handleFollowToggle = async () => {
    if (actionLoading) return;

    setActionLoading(true);
    const url = isFollowing ? `/users/${id}/unfollow` : `/users/${id}/follow`;

    try {
      await axiosInstance.post(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setIsFollowing(!isFollowing);
      // تحديث رقم المتابعين محلياً لو حبيتي
      setFollowersList((prev) =>
        isFollowing
          ? prev.filter((user) => user.id !== parseInt(id))
          : [...prev, { id: parseInt(id), name: profileData.name }]
      );
    } catch (error) {
      console.error("Follow action failed:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-bg-primary-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>DevHub | {profileData.name || "Profile"}</title>
      </Helmet>
      <div className="bg-slate-50 dark:bg-bg-primary-dark relative min-h-screen">
        <div className="flex-1 py-2">
          <div className="container sm:mx-auto px-2 sm:px-0 lg:px-3">
            <div className="max-w-7xl sm:max-w-[90%] mx-auto">
              {/* Profile Header */}
              <div className="bg-card rounded-xl border border-gray-200 overflow-hidden shadow-lg mb-5 dark:border-bg-primary-dark dark:bg-bg-secondary-dark">
                <div className="relative h-50 sm:h-65">
                  <div className="absolute inset-0 opacity-85">
                    <img
                      src={
                        coverImage ||
                        `https://ui-avatars.com/api/?name=${profileData.name}&background=003890&color=fff`
                      }
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 sm:-mt-20 mb-6">
                    <div className="relative">
                      <img
                        src={
                          profileImage ||
                          `https://ui-avatars.com/api/?name=${profileData.name}&background=random`
                        }
                        alt={profileData.name}
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white dark:border-black shadow-xl"
                      />
                    </div>

                    <div className="flex gap-2 ml-auto items-center">   
                      {parseInt(id) && (
                        <button
                          onClick={handleFollowToggle}
                          disabled={actionLoading}
                          className={`rounded-full mt-26 py-2 px-6 font-bold transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex items-center gap-2 ${
                            isFollowing
                              ? "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                              : "bg-primary text-white"
                          }`}
                        >
                          {actionLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : isFollowing ? (
                            "Unfollow"
                          ) : (
                            "Follow"
                          )}
                        </button>
                      )}
                      <button className="rounded-full bg-primary text-white py-2 px-3 cursor-pointer md:mt-25 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                        Message
                      </button>
                      <button className="rounded-full border-border mt-25 cursor-pointer hover:text-red-600 transition-colors duration-200">
                        <Ban className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h1 className="mb-2 font-semibold text-2xl dark:text-gray-100">
                      {profileData.name}
                    </h1>
                    <p className="text-muted-foreground mb-4 dark:text-gray-200">
                      {profileData.bio}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1 dark:text-gray-300">
                        <BookOpen className="w-4 h-4" />
                        <span>{profileData.education}</span>
                      </div>
                      <div className="flex items-center gap-1 dark:text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {profileData.joined_at}</span>
                      </div>
                      <div className="flex items-center gap-1 dark:text-gray-300">
                        <MapPin className="w-4 h-4" />
                        <span>{profileData.location}</span>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex flex-wrap gap-4 mt-4">
                      {socialMediaPlatforms.map((platform) => {
                        const socialInfo =
                          profileData.social_links[platform.name];
                        if (!socialInfo?.url) return null;

                        return (
                          <a
                            key={platform.name}
                            href={socialInfo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 transition-colors"
                          >
                            <platform.icon className="w-5 h-5" />
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-300 dark:border-gray-700">
                    <div>
                      <p className="text-text-light dark:text-text-dark font-bold">
                        {postsList.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Posts</p>
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => navigate(`/users/${id}/followers`)}
                    >
                      <p className="text-text-light dark:text-text-dark font-bold">
                        {followersList.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Followers</p>
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        navigate(`/users/${id}/following`, {
                          state: { authorName: profileData.name },
                        })
                      }
                    >
                      <p className="text-text-light dark:text-text-dark font-bold">
                        {followingList.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Following</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="w-full">
                <div className="grid grid-cols-2 bg-card border border-gray-200 rounded-2xl p-1 shadow-xl dark:border-bg-secondary-dark dark:bg-bg-secondary-dark">
                  {["posts", "questions"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-xl py-2 text-sm font-medium transition-all duration-300 ${
                        activeTab === tab
                          ? "bg-primary text-white shadow-md"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="mt-6 mb-10">
                  {activeTab === "posts" && (
                    <UserPostsTab userId={id} author={profileData.name} />
                  )}
                  {activeTab === "questions" && (
                    <UserQATab title="Questions" author={profileData.name} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Component */}
        <div className="fixed bottom-4 right-4 z-50 lg:hidden">
          <Messages />
        </div>
        <div className="fixed bottom-0 left-2 z-50 w-[18%] hidden lg:block">
          <Messages />
        </div>
      </div>
    </>
  );
};

export default UsersProfile;
