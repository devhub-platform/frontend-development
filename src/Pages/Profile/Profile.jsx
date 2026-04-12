/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import {
  Linkedin,
  Github,
  Share2,
  Calendar,
  BookOpen,
  ChevronRight,
  Settings,
  X,
  Upload,
  Camera,
  MapPin,
} from "lucide-react";
import { Messages } from "../../Components/Messages/Messages";
import Post from "../../Components/Post/Post";
import { posts } from "../../context/PostsData";
import EditProfile from "../../Components/EditProfile/EditProfile";
import { UserContext } from "../../context/UserContext";
import PostsTab from "../../Components/ProfileTabs/PostsTab";
import DraftsTab from "../../Components/ProfileTabs/DraftsTab";
import ArchivedTab from "../../Components/ProfileTabs/ArchivedTab";
import ReadingListTab from "../../Components/ProfileTabs/ReadingListTab";
import DashboardTab from "../../Components/ProfileTabs/DashboardTab";
import QATab from "../../Components/ProfileTabs/QATab";
import { FaUserGraduate } from "react-icons/fa";
import { SiOrcid } from "react-icons/si"; // أضفت أيقونة orcid كمثال
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import axiosInstance from "../../config/api";

const mockCollections = [
  {
    id: 1,
    title: "Frontend Tips",
    description: "Modern web development techniques and best practices",
    postCount: 8,
    posts: [
      { id: 1, title: "The Art of Clean Code: Principles and Practices" },
      { id: 2, title: "CSS Grid vs Flexbox: When to Use Each" },
      { id: 3, title: "React Performance Optimization Techniques" },
    ],
    imgs: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=400",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400",
      },
    ],
    updatedAt: "Updated 5 days ago",
  },
  {
    id: 2,
    title: "System Design",
    description: "Scalable architecture patterns and distributed systems",
    postCount: 15,
    posts: [
      { id: 1, title: "Understanding Microservices Architecture" },
      { id: 2, title: "Building Resilient Distributed Systems" },
      { id: 3, title: "Database Sharding Strategies Explained" },
    ],
    imgs: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400",
      },
    ],
    updatedAt: "Updated 1 week ago",
  },
];

const Profile = () => {
  const { userData } = useContext(UserContext);
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
    work_at: "",
    joined_at: "",
    linkedin: "",
    github: "",
    orcid: "",
    social_links: {}, // سنخزن الكائن بالكامل هنا (username و url)
    number_of_posts_published: "",
    number_of_followers: "",
    number_of_users_followed: "",
    number_of_views_in_his_posts: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [openReactionId, setOpenReactionId] = useState(null);

  // تعريف المنصات والأيقونات فقط بدون بريفكس
  const socialMediaPlatforms = [
    { name: "linkedin", icon: Linkedin },
    { name: "github", icon: Github },
    { name: "scholar", icon: FaUserGraduate },
    { name: "orcid", icon: SiOrcid },
  ];

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get(
          "/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );

        const response2 = await axiosInstance.get(
          "/profile/details",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );

        const user = response.data.data;
        const userDetails = response2.data.data;
        setProfileData({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          bio: user.bio || "",
          education: user.education || "",
          location: user.location || "",
          joined_at: user.joined_at || "recent",
          linkedin: user.social_links?.linkedin?.url || "",
          github: user.social_links?.github?.url || "",
          orcid: user.social_links?.orcid?.url || "",
          social_links: user.social_links || {}, // نأخذ الروابط كما هي من الـ API
          number_of_posts_published: userDetails.number_of_posts_published || 0,
          number_of_followers: userDetails.number_of_followers || 0,
          number_of_users_followed: userDetails.number_of_users_followed || 0,
        });

        setProfileImage(user.avatar_url);
        setCoverImage(user.cover_image);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setIsLoading(false);
      }
    };

    if (token) fetchProfileData();
  }, [token]);

  const handleSaveProfile = async () => {
    try {
      const payload = {
        name: profileData.name,
        username: profileData.username,
        bio: profileData.bio,
        education: profileData.education,
        location: profileData.location,
        // social_links: profileData.social_links,
        number_of_posts_published: profileData.number_of_posts_published,
        number_of_followers: profileData.number_of_followers,
        number_of_users_followed: profileData.number_of_users_followed,
      };

      const response = await axiosInstance.patch(
        "/profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      const response2 = await axiosInstance.get(
        "/profile/details",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      setProfileData((prev) => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          linkedin: { url: prev.linkedin },
          github: { url: prev.github },
          orcid: { url: prev.orcid },
        },
      }));

      if (response.data || response2.data) {
        alert("Profile updated successfully! 🎉");
        setShowEditDialog(false);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const viewsData = [
    { mon: "Jan", views: 400 },
    { mon: "Feb", views: 800 },
    { mon: "Mar", views: 650 },
    { mon: "Apr", views: 1200 },
    { mon: "May", views: 900 },
    { mon: "June", views: 400 },
    { mon: "July", views: 800 },
    { mon: "Aug", views: 650 },
    { mon: "Sep", views: 1200 },
    { mon: "Oct", views: 900 },
    { mon: "Nov", views: 400 },
    { mon: "Dec", views: 800 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-bg-primary-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
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
                        `https://ui-avatars.com/api/?name=${profileData.name || "User"}&background=003890&color=fff`
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
                          `https://ui-avatars.com/api/?name=${profileData.name || "User"}&background=random`
                        }
                        alt={profileData.name}
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white dark:border-black shadow-xl"
                      />
                    </div>

                    <div className="flex gap-4 ml-auto items-center">
                      <button className="rounded-full border-border mt-25 cursor-pointer">
                        <Share2 className="w-5 h-5" />
                      </button>
                      <button
                        className="rounded-full bg-primary text-white py-2 px-3 cursor-pointer md:mt-25 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                        onClick={() => setShowEditDialog(true)}
                      >
                        Edit Profile
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
                        <span>
                          {profileData.education || "No education info"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 dark:text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {profileData.joined_at}</span>
                      </div>
                      <div className="flex items-center gap-1 dark:text-gray-300">
                        <MapPin className="w-4 h-4" />
                        <span>{profileData.location || "Earth"}</span>
                      </div>
                    </div>

                    {/* Social Media Links - Modified Section */}
                    <div className="flex flex-wrap gap-4 mt-4">
                      {socialMediaPlatforms.map((platform) => {
                        const url =
                          profileData.social_links[platform.name]?.url ||
                          profileData[platform.name];

                        if (!url) return null;

                        return (
                          <a
                            key={platform.name}
                            href={url}
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

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-300 dark:border-gray-700">
                    <div>
                      <p className="text-text-light dark:text-text-dark font-bold">
                        {profileData.number_of_posts_published || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Posts</p>
                    </div>
                    <div>
                      <p className="text-text-light dark:text-text-dark font-bold">
                        {profileData.number_of_followers || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Followers</p>
                    </div>
                    <div>
                      <p className="text-text-light dark:text-text-dark font-bold">
                        {profileData.number_of_users_followed || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Following</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-text-light dark:text-text-dark font-bold">
                        {profileData.number_of_views_in_his_posts || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Views
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="w-full">
                <div className="grid lg:grid-cols-6 grid-cols-2 md:grid-cols-3 bg-card border border-gray-200 rounded-2xl p-1 shadow-xl dark:border-bg-secondary-dark dark:bg-bg-secondary-dark">
                  {[
                    "posts",
                    "reading",
                    "draft",
                    "archived",
                    "dashboard",
                    "qestions",
                  ].map((tab) => (
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
                    <PostsTab
                      openReactionId={openReactionId}
                      setOpenReactionId={setOpenReactionId}
                    />
                  )}
                  {activeTab === "draft" && (
                    <DraftsTab
                      title="Your Draft Posts Appear Here"
                      openReactionId={openReactionId}
                      setOpenReactionId={setOpenReactionId}
                    />
                  )}
                  {activeTab === "archived" && (
                    <ArchivedTab
                      title="Your Archived Posts Appear Here"
                      openReactionId={openReactionId}
                      setOpenReactionId={setOpenReactionId}
                    />
                  )}
                  {activeTab === "reading" && (
                    <ReadingListTab mockCollections={mockCollections} />
                  )}
                  {activeTab === "dashboard" && (
                    <DashboardTab viewsData={viewsData} />
                  )}
                  {activeTab === "qestions" && (
                    <QATab
                      title="Your Questions Appear Here"
                      openReactionId={openReactionId}
                      setOpenReactionId={setOpenReactionId}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-4 right-4 z-50 lg:hidden">
          <Messages />
        </div>
        <div className="fixed bottom-0 left-2 z-50 w-[18%] hidden lg:block">
          <Messages />
        </div>

        <EditProfile
          showEditDialog={showEditDialog}
          handleCancelEdit={() => setShowEditDialog(false)}
          handleSaveProfile={handleSaveProfile}
          profileData={profileData}
          setProfileData={setProfileData}
          profileImage={profileImage}
          coverImage={coverImage}
          setProfileImage={setProfileImage}
          setCoverImage={setCoverImage}
          token={token}
        />
      </div>
    </>
  );
};

export default Profile;
