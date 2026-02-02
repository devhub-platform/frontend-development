/* eslint-disable no-unused-vars */
import React, {useState} from 'react'
import { Linkedin, Github, Share2, Calendar, BookOpen, ChevronRight, Settings, X, Upload, Camera, MapPin } from 'lucide-react';
import { Messages } from "../../Components/Messages/Messages";
import Post from "../../Components/Post/Post";
import { posts } from "../../context/PostsData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockCollections = [
  {
    id: 1,
    title: "AI & Machine Learning",
    description: "Articles about artificial intelligence, neural networks, and ML algorithms",
    postCount: 12,
    posts: [
      { id: 1, title: "Deep Learning Fundamentals: A Comprehensive Guide" },
      { id: 2, title: "Understanding Neural Networks from Scratch" },
      { id: 3, title: "GPT-4 and the Future of Large Language Models" }
    ],
    imgs: [
      { id: 1, url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400" },
      { id: 2, url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400" },
      { id: 3, url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400" }
    ],
    updatedAt: "Updated 2 days ago"
  },
  {
    id: 2,
    title: "Frontend Tips",
    description: "Modern web development techniques and best practices",
    postCount: 8,
    posts: [
      { id: 1, title: "The Art of Clean Code: Principles and Practices" },
      { id: 2, title: "CSS Grid vs Flexbox: When to Use Each" },
      { id: 3, title: "React Performance Optimization Techniques" }
    ],
    imgs: [
      { id: 1, url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400" },
      { id: 2, url: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=400" },
      { id: 3, url: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400" }
    ],
    updatedAt: "Updated 5 days ago"
  },
  {
    id: 3,
    title: "System Design",
    description: "Scalable architecture patterns and distributed systems",
    postCount: 15,
    posts: [
      { id: 1, title: "Understanding Microservices Architecture" },
      { id: 2, title: "Building Resilient Distributed Systems" },
      { id: 3, title: "Database Sharding Strategies Explained" }
    ],
    imgs: [
      { id: 1, url: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400" },
      { id: 2, url: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400" },
      { id: 3, url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400" }
    ],
    updatedAt: "Updated 1 week ago"
  },
  {
    id: 4,
    title: "Career & Growth",
    description: "Professional development and career advancement insights",
    postCount: 6,
    posts: [
      { id: 1, title: "How to Ace Technical Interviews" },
      { id: 2, title: "Building a Personal Brand as a Developer" },
      { id: 3, title: "Transitioning from Junior to Senior Developer" }
    ],
    imgs: [
      { id: 1, url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400" },
      { id: 2, url: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=400" },
      { id: 3, url: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400" }
    ],
    updatedAt: "Updated 3 days ago"
  },
  {
    id: 5,
    title: "UX & Design",
    description: "User experience design principles and visual design",
    postCount: 10,
    posts: [
      { id: 1, title: "Design Systems at Scale: A Case Study" },
      { id: 2, title: "The Psychology of Color in UI Design" },
      { id: 3, title: "Accessibility First: Building Inclusive Web Experiences" }
    ],
    imgs: [
      { id: 1, url: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400" },
      { id: 2, url: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400" },
      { id: 3, url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400" }
    ],
    updatedAt: "Updated 4 days ago"
  }
];

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: 'Sarah Johnson',
    username: 'sarahjohnson',
    email: 'sarah.johnson@example.com',
    bio: 'Tech writer & AI enthusiast. Sharing insights on artificial intelligence, content creation, and the future of digital storytelling.',
    skills:' AI, Machine Learning, Content Creation, Blogging, Digital Marketing',
    education: 'Computer Science, University of California, Berkeley',
    location: 'San Francisco, CA',
    linkedin: 'sarah-johnson',
    github: 'sarahjohnson',
  });
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1552660838-729b42bac4a7?w=300&q=80");
  const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070");
  const [tempProfileImage, setTempProfileImage] = useState(null);
  const [tempCoverImage, setTempCoverImage] = useState(null);
  const socialMediaPlatforms = [
    { name: 'linkedin', icon: Linkedin, prefix: 'linkedin.com/in/', placeholder: 'username'},
    { name: 'github', icon: Github, prefix: 'github.com/', placeholder: 'username'},
  ];

  const [showEditDialog, setShowEditDialog] = useState(false);
  const handleProfileImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (tempProfileImage) setProfileImage(tempProfileImage);
    if (tempCoverImage) setCoverImage(tempCoverImage);
    setShowEditDialog(false);
    setTempProfileImage(null);
    setTempCoverImage(null);
  };

  const handleCancelEdit = () => {
    setShowEditDialog(false);
    setTempProfileImage(null);
    setTempCoverImage(null);
  };

  const [activeTab, setActiveTab] = useState("posts");
  const [openReactionId, setOpenReactionId] = useState(null);
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

  return <>
  <div className=" dark:bg-bg-primary-dark relative min-h-screen">
    <div className="flex-1 py-2">
<div className="container sm:mx-auto px-2 sm:px-0 lg:px-3">
        <div className="max-w-6xl sm:max-w-[80%] mx-auto">
          {/* Profile Header */}
          <div className="bg-card rounded-xl border border-gray-200 overflow-hidden shadow-lg mb-5 dark:border-bg-primary-dark dark:bg-bg-secondary-dark">
            {/* Cover Image with linear */}
            <div className="relative h-50 sm:h-65">
              <div className="absolute inset-0 opacity-85">
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 sm:-mt-20 mb-6">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={profileImage}
                    alt={profileData.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-card shadow-xl border-white dark:border-black dark:shadow-bg-primary-dark"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-4 ml-auto items-center">
                  <button
                    className="rounded-full border-border flex items-center mt-25 cursor-pointer"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    className="rounded-full border-border flex items-center bg-primary text-white py-2 px-3 cursor-pointer mt-25 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                    onClick={() => setShowEditDialog(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Name & Bio */}
              <div className="mb-6">
                <h1 className="mb-2 font-semibold text-2xl dark:text-gray-100">{profileData.name}</h1>
                <p className="text-muted-foreground mb-4 dark:text-gray-200">
                  {profileData.bio}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground text-gray-600">
                  <div className="flex items-center gap-1 dark:text-gray-300">
                    <BookOpen className="w-4 h-4" />
                    <span>{profileData.education}</span>
                  </div>
                  <div className="flex items-center gap-1 dark:text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>Joined Oct 2024</span>
                  </div>
                  {/* <div className="flex items-center gap-1">
                    <LinkIcon className="w-4 h-4" />
                    <a
                      href={`https://${profileData.website}`}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {profileData.website}
                    </a>
                  </div> */}
                </div>

                {/* Social Media Links */}
                <div className="flex items-center gap-3 mt-4 text-gray-700 dark:text-gray-300">
                  {profileData.linkedin && (
                    <a href={`https://linkedin.com/in/${profileData.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-text-light dark:hover:text-text-dark">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {profileData.github && (
                    <a href={`https://github.com/${profileData.github}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-text-light dark:hover:text-text-dark">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-300 dark:border-gray-700">
                <div>
                  <p className="bg-linear-to-r text-text-light dark:text-text-dark">
                    24
                  </p>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
                <div className="cursor-pointer">
                  <p className="bg-linear-to-r text-text-light dark:text-text-dark">
                    1.2K
                  </p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="cursor-pointer">
                  <p className="bg-linear-to-r text-text-light dark:text-text-dark">
                    487
                  </p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
                <div className="hidden sm:block">
                  <p className="bg-linear-to-r text-text-light dark:text-text-dark">
                    45K
                  </p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="w-full">
  {/* Tabs Header */}
  <div className="grid grid-cols-5 bg-card border border-gray-200 rounded-2xl p-1 shadow-xl dark:border-bg-secondary-dark dark:bg-bg-secondary-dark">
    {[
      { key: "posts", label: "Posts" },
      { key: "reading", label: "Reading List" },
      { key: "draft", label: "Draft" },
      { key: "archived", label: "Archived" },
      { key: "dashboard", label: "Dashboard" },
    ].map((tab) => (
      <button
        key={tab.key}
        onClick={() => setActiveTab(tab.key)}
        className={`
          rounded-xl py-2 text-sm font-medium transition-all duration-300
          ${
            activeTab === tab.key
              ? "bg-primary text-white shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }
        `}
      >
        {tab.label}
      </button>
    ))}
  </div>

  {/* Tabs Content */}
  <div className="mt-6 mb-5 dark:bg-bg-secondary-dark rounded-2xl dark:border-bg-secondary-dark">
    {activeTab === "posts" && (
      <div className="p-6 rounded-2xl border border-gray-200 shadow-xl  dark:border-bg-secondary-dark">
        <h3 className="mb-2 font-semibold text-2xl">Your Published Posts Appear Here</h3>
        <div className="flex flex-col items-center dark:bg-bg-secondary-dark rounded-xl">
                  {posts.map((post) => (
                    <Post key={post.id} post={post}
                          isReactionOpen={openReactionId === post.id}
                          setOpenReactionId={setOpenReactionId} />
                  ))}
                </div>
      </div>
    )}

    {activeTab === "reading" && (
      <div className="p-6 bg-card rounded-2xl border border-gray-200 shadow-xl dark:border-bg-secondary-dark">
        <h3 className="mb-2 font-semibold text-2xl">Your Reading Lists Appear Here</h3>
        {mockCollections.length > 0 ? (
        <div className="space-y-4">
          {mockCollections.map((collection) => (
            <article
              key={collection.id}
              className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-50 cursor-pointer
                          dark:bg-bg-secondary-dark dark:border-bg-secondary-dark dark:hover:border-blue-900/10 dark:shadow-2xl"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Title and Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-text-light transition-colors
                                    dark:text-gray-100 dark:group-hover:text-text-dark">
                          {collection.title}
                        </h3>
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full text-white bg-primary`}>
                          {collection.postCount} posts
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 leading-relaxed dark:text-gray-200">
                        {collection.description}
                      </p>
                      {/* <p className="text-xs text-gray-500 font-medium dark:text-gray-300">
                        {collection.updatedAt}
                      </p> */}
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <button 
                    className="shrink-0 p-2 text-gray-400 group-hover:text-text-light group-hover:bg-blue-50 rounded-lg transition-all
                    dark:group-hover:bg-blue-900/20 dark:group-hover:text-text-dark"
                    aria-label="View reading list"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                {/* Post Previews */}
                  <div className="flex items-center gap-4 pl-16 space-y-2">
  {collection.imgs.slice(0, 3).map((img) => (
    <div 
      key={img.id}
      className="flex items-center gap-3"
    >
      <img
        src={img.url}
        alt="Collection preview"
        className="w-50 h-35 rounded-lg object-cover border border-gray-200
                   dark:border-bg-secondary-dark"
      />
    </div>
  ))}

  {collection.postCount > 3 && (
    <div className="text-sm text-gray-500 dark:text-gray-300 pt-2">
      +{collection.postCount - 3} more posts
    </div>
  )}
</div>
              </div>

              {/* Hover Highlight Border */}
              <div className="h-1 bg-linear-to-r from-primary to-text-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left dark:to-text-dark"></div>
            </article>
          ))}
        </div>
      ) : "No Reading Lists Yet."}
      </div>
    )}

    {activeTab === "draft" && (
      <div className="p-6 bg-card rounded-2xl border border-gray-200 shadow-xl dark:border-bg-secondary-dark">
        <h3 className="mb-2 font-semibold text-2xl">Your Draft Posts Appear Here</h3>
        <div className="flex flex-col items-center dark:bg-bg-secondary-dark rounded-xl dark:border-bg-secondary-dark">
                  {posts.map((post) => (
                    <Post key={post.id} post={post}
                          isReactionOpen={openReactionId === post.id}
                          setOpenReactionId={setOpenReactionId} />
                  ))}
                </div>
      </div>
    )}

    {activeTab === "archived" && (
      <div className="p-6 bg-card rounded-2xl border border-gray-200 shadow-xl dark:border-bg-secondary-dark">
        <h3 className="mb-2 font-semibold text-2xl">Your Archieved Posts Appear Here</h3>
        <div className="flex flex-col items-center dark:bg-bg-secondary-dark rounded-xl dark:border-bg-secondary-dark">
                  {posts.map((post) => (
                    <Post key={post.id} post={post}
                          isReactionOpen={openReactionId === post.id}
                          setOpenReactionId={setOpenReactionId} />
                  ))}
                </div>
      </div>
    )}

    {activeTab === "dashboard" && (
      <div className="p-6 bg-card rounded-2xl border border-gray-200 shadow-xl dark:border-bg-secondary-dark">
        <h3 className="mb-2 font-semibold text-2xl">Dashboard</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  {[
    { label: "Posts", value: "25" },
    { label: "Total Views", value: "45K" },
    { label: "Total Reactions", value: "2.3K" },
    { label: "Total Comments", value: "487" },
  ].map((item, i) => (
    <div
      key={i}
      className="p-5 bg-card rounded-2xl border border-border group bg-white shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-100 hover:border-blue-50 cursor-pointer
                dark:border-2     dark:bg-bg-secondary-dark dark:border-bg-secondary-dark dark:hover:border-blue-900/10 dark:shadow-2xl"
    >
      <p className="text-sm text-muted-foreground text-text-light dark:text-text-dark">{item.label}</p>
      <p className="text-xl font-semibold">{item.value}</p>
    </div>
  ))}
</div>
<div className="p-5 bg-card rounded-2xl border border-border group bg-white shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-100 hover:border-blue-50 cursor-pointer
                dark:border-2     dark:bg-bg-secondary-dark dark:border-bg-secondary-dark dark:hover:border-blue-900/10 dark:shadow-2xl">
  <h3 className="mb-4 font-semibold dark:text-gray-200">Profile Views</h3>
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={viewsData}>
      <XAxis dataKey="mon" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="views"
        stroke="#3b82f6"
        strokeWidth={3}
      />
      <Line
        type="monotone"
        dataKey="followers"
        stroke="red"
        strokeWidth={3}
      />
      <Line
        type="monotone"
        dataKey="sharedPosts"
        stroke="purple"
        strokeWidth={3}
      />
    </LineChart>
  </ResponsiveContainer>
</div>


      </div>
    )}
  </div>
</div>

        </div>
        </div>
    </div>

    {/* زر عائم للموبايل / تابلت (أيقونة فقط) */}
    <div className="fixed bottom-4 right-4 z-50 lg:hidden">
      <Messages />
    </div>

    {/* Sidebar لسطح المكتب – الكود الأصلي كما هو */}
    <div className="fixed bottom-0 left-2 z-50 w-[18%]">
      <Messages />
    </div>

    {/* --- Edit Profile Modal --- */}
{showEditDialog && (
  <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white dark:bg-bg-secondary-dark w-full max-w-175 max-h-[90vh] rounded-3xl shadow-2xl border-2 border-[#62b6cb]/20 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-[#1b4965] dark:text-gray-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-text-light dark:text-text-dark" />
            Edit Profile
          </h2>
          <p className="text-gray-500 text-sm mt-1 dark:text-gray-300">Update your profile information, images, and social media links.</p>
        </div>
        <button 
          onClick={handleCancelEdit}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6 overflow-y-scroll dark-scrollbar">
        {/* Cover Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1b4965] dark:text-gray-200">Cover Image</label>
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#62b6cb]/20 h-32 group">
            <img
              src={tempCoverImage || coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <input 
              type="file" 
              id="cover-upload-modal" 
              accept="image/*" 
              onChange={handleCoverImageUpload} 
              className="hidden" 
            />
            <button
              onClick={() => document.getElementById('cover-upload-modal')?.click()}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-2 text-white">
                <Upload className="w-6 h-6" />
                <span className="text-sm">Upload Cover</span>
              </div>
            </button>
            {tempCoverImage && (
              <button
                onClick={() => setTempCoverImage(null)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-lg p-2 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Profile Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1b4965] dark:text-gray-200">Profile Picture</label>
          <div className="flex items-center gap-4">
            <div className="relative group w-24 h-24">
              <img
                src={tempProfileImage || profileImage}
                alt="Profile"
                className="w-full h-full rounded-2xl object-cover border-2 border-[#62b6cb]/20"
              />
              <input 
                type="file" 
                id="profile-upload-modal" 
                accept="image/*" 
                onChange={handleProfileImageUpload} 
                className="hidden" 
              />
              {/* <button
                onClick={() => document.getElementById('profile-upload-modal')?.click()}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-center justify-center text-white"
              >
                <Camera className="w-6 h-6" />
              </button> */}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => document.getElementById('profile-upload-modal')?.click()}
                className="px-4 py-2 border border-blue-100 rounded-xl hover:bg-blue-100 dark:hover:bg-bg-secondary-dark transition-colors text-sm font-medium
                            dark:border-blue-800/10 dark:bg-bg-primary-dark dark:text-gray-200"
              >
                Upload New Picture
              </button>
              {tempProfileImage && (
                <button
                  onClick={() => setTempProfileImage(null)}
                  className="text-red-500 text-sm hover:underline text-left"
                >
                  Remove temporary image
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#62b6cb] outline-none dark:bg-gray-800 dark:border-gray-700"
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">Username</label>
            <input
              type="text"
              value={profileData.username}
              onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#62b6cb] outline-none dark:bg-gray-800 dark:border-gray-700"
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={profileData.location || ''}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#62b6cb] outline-none dark:bg-gray-800 dark:border-gray-700"
                placeholder="City, Country"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">Education</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={profileData.education || ''}
                onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#62b6cb] outline-none dark:bg-gray-800 dark:border-gray-700"
                placeholder="City, Country"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">Email</label>
          <input
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#62b6cb] outline-none dark:bg-gray-800 dark:border-gray-700"
            placeholder="Your email address"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">Bio</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#62b6cb] outline-none  min-h-25 dark:bg-gray-800 dark:border-gray-700"
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">Skills</label>
          <textarea
            value={profileData.skills}
            onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#62b6cb] outline-none  min-h-20 dark:bg-gray-800 dark:border-gray-700"
            placeholder="Tell us about your skills..."
          />
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-[#1b4965] dark:text-gray-200">Social Media</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socialMediaPlatforms.map((platform) => (
              <div key={platform.name} className="space-y-2">
                <label className="text-xs font-medium capitalize flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <platform.icon className="w-4 h-4" style={{ color: platform.color }} />
                  {platform.name}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                    {platform.prefix}
                  </span>
                  <input
                    type="text"
                    value={profileData[platform.name] || ''}
                    onChange={(e) => setProfileData({ ...profileData, [platform.name]: e.target.value })}
                    className="w-full pl-28 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:border-[#62b6cb] outline-none dark:bg-gray-800 dark:border-gray-700"
                    placeholder={platform.placeholder}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
        <button
          onClick={handleCancelEdit}
          className="px-6 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium
                  dark:bg-gray-900 dark:border-0"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveProfile}
          className="px-6 py-2 rounded-xl bg-primary text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex items-center gap-2 font-medium"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
  </div>
  
  </>
}

export default Profile