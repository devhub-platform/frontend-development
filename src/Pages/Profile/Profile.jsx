/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import { Linkedin, Github, Share2, Calendar, BookOpen, ChevronRight, Settings, X, Upload, Camera,MapPin } from "lucide-react";
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
import { FaUserGraduate } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

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
    linkedin: "",
    github: "",
    scholar: "",
    joined_at: "",
    social_links: {},
  });

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [tempProfileImage, setTempProfileImage] = useState(null);
  const [tempCoverImage, setTempCoverImage] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [openReactionId, setOpenReactionId] = useState(null);

  const socialMediaPlatforms = [
    {
      name: "linkedin",
      icon: Linkedin,
      prefix: "https://linkedin.com/in/",
      placeholder: "username",
    },
    {
      name: "github",
      icon: Github,
      prefix: "https://github.com/",
      placeholder: "username",
    },
    {
      name: "scholar",
      icon: FaUserGraduate,
      prefix: "https://scholar.google.com/",
      placeholder: "username",
    },
  ];

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          "http://devhub.eu-north-1.elasticbeanstalk.com/api/v1/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          },
        );

        const user = response.data.data;

        setProfileData({
          name: user.name || "Mai Waleed",
          username: user.username || "",
          email: user.email || "",
          bio: user.bio || "",
          skills: user.skills?.length > 0 ? user.skills.join(", ") : "",
          education: user.education || "Not specified",
          location: user.location || "Not specified",
          github: user.social_links?.github?.username || "",
          linkedin: user.social_links?.linkedin?.username || "",
          scholar: user.social_links?.scholar?.username || "",
          joined_at: user.joined_at || "recent",
        });

        if (user.avatar_url) setProfileImage(user.avatar_url);
        if (user.cover_image) setCoverImage(user.cover_image);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setIsLoading(false);
      }
    };

    if (token) fetchProfileData();
  }, [token]);

  const handleProfileImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempCoverImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const payload = {
        name: profileData.name,
        username: profileData.username,
        bio: profileData.bio,
        email: profileData.email,
        education: profileData.education,
        work_at: profileData.work_at,
        skills: Array.isArray(profileData.skills) ? profileData.skills : [],
        // لو مفيش صورة مرفوعة، نبعت الـ Avatar الافتراضي المبني على الاسم
        social_links: {
          linkedin: { username: profileData.linkedin || "" },
          github: { username: profileData.github || "" },
          scholar: { username: profileData.scholar || "" },
        },
        avatar_url:
          tempProfileImage ||
          profileImage ||
          `https://ui-avatars.com/api/?name=${profileData.name}&background=random`,
        cover_image:
          tempCoverImage ||
          coverImage ||
          `https://ui-avatars.com/api/?name=${profileData.name}&background=003890&color=fff`,
      };

      const response = await axios.patch(
        "http://devhub.eu-north-1.elasticbeanstalk.com/api/v1/profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.data) {
        setProfileData(response.data.data);
        if (tempProfileImage) setProfileImage(tempProfileImage);
        if (tempCoverImage) setCoverImage(tempCoverImage);
        setShowEditDialog(false);
        setTempProfileImage(null);
        setTempCoverImage(null);
        alert("Profile updated successfully! 🎉");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const handleCancelEdit = () => {
    setShowEditDialog(false);
    setTempProfileImage(null);
    setTempCoverImage(null);
  };

  const viewsData = [
    { mon: "Jan", views: 400, followers: 200, sharedPosts: 6 },
    { mon: "Feb", views: 800, followers: 400, sharedPosts: 0 },
    { mon: "Mar", views: 650, followers: 300, sharedPosts: 1 },
    { mon: "Apr", views: 1200, followers: 600, sharedPosts: 4 },
    { mon: "May", views: 900, followers: 500, sharedPosts: 2 },
    { mon: "June", views: 400, followers: 250, sharedPosts: 1 },
    { mon: "July", views: 800, followers: 450, sharedPosts: 0 },
    { mon: "Aug", views: 650, followers: 350, sharedPosts: 2 },
    { mon: "Sep", views: 1200, followers: 700, sharedPosts: 3 },
    { mon: "Oct", views: 900, followers: 550, sharedPosts: 1 },
    { mon: "Nov", views: 400, followers: 250, sharedPosts: 4 },
    { mon: "Dec", views: 800, followers: 150, sharedPosts: 0 },
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
            <div className="max-w-7xl sm:max-w-[85%] mx-auto">
              {/* Profile Header */}
              <div className="bg-card rounded-xl border border-gray-200 overflow-hidden shadow-lg mb-5 dark:border-bg-primary-dark dark:bg-bg-secondary-dark">
                <div className="relative h-50 sm:h-65">
                  <div className="absolute inset-0 opacity-85">
                    <img
                      src={
                        coverImage ||
                        `https://ui-avatars.com/api/?name=${profileData.name || "User"}&background=003890&color=fff&size=128`
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
                          `https://ui-avatars.com/api/?name=${profileData.name || "User"}&background=random&color=fff&size=128`
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

                    {/* Social Media Links */}
                    <div className="flex flex-wrap gap-4 mt-4">
                      {socialMediaPlatforms.map((platform) => {
                        const platformUsername = profileData[platform.name];
                        if (!platformUsername) return null;

                        return (
                          <a
                            key={platform.name}
                            href={`${platform.prefix}${platformUsername}`}
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
                        24
                      </p>
                      <p className="text-sm text-muted-foreground">Posts</p>
                    </div>
                    <div>
                      <p className="text-text-light dark:text-text-dark font-bold">
                        1.2K
                      </p>
                      <p className="text-sm text-muted-foreground">Followers</p>
                    </div>
                    <div>
                      <p className="text-text-light dark:text-text-dark font-bold">
                        487
                      </p>
                      <p className="text-sm text-muted-foreground">Following</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-text-light dark:text-text-dark font-bold">
                        45K
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
                <div className="grid lg:grid-cols-5 grid-cols-2 md:grid-cols-3 bg-card border border-gray-200 rounded-2xl p-1 shadow-xl dark:border-bg-secondary-dark dark:bg-bg-secondary-dark">
                  {["posts", "reading", "draft", "archived", "dashboard"].map(
                    (tab) => (
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
                    ),
                  )}
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
                    <DraftsTab
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
          handleCancelEdit={handleCancelEdit}
          handleSaveProfile={handleSaveProfile} // مرري الدالة الحقيقية هنا
          profileData={profileData}
          setProfileData={setProfileData}
          // نمرر الصور مع الـ Fallback للحروف لو كانت null
          profileImage={
            profileImage ||
            `https://ui-avatars.com/api/?name=${profileData.name}&background=random`
          }
          coverImage={
            coverImage ||
            `https://ui-avatars.com/api/?name=${profileData.name}&background=003890&color=fff`
          }
          tempProfileImage={tempProfileImage}
          setTempProfileImage={setTempProfileImage}
          tempCoverImage={tempCoverImage}
          setTempCoverImage={setTempCoverImage}
          handleProfileImageUpload={handleProfileImageUpload}
          handleCoverImageUpload={handleCoverImageUpload}
          socialMediaPlatforms={socialMediaPlatforms}
        />
      </div>
    </>
  );
};

export default Profile;
