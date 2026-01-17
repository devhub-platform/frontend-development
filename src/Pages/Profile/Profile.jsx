import React, {useState} from 'react'
import { Linkedin, Github, Share2, Calendar, BookOpen } from 'lucide-react';
import { Messages } from "../../Components/Messages/Messages";
import Post from "../../Components/Post/Post";
import { posts } from "../../context/PostsData";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: 'Sarah Johnson',
    bio: 'Tech writer & AI enthusiast. Sharing insights on artificial intelligence, content creation, and the future of digital storytelling.',
    education: 'Computer Science, University of California, Berkeley',
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
  <div className="grid grid-cols-4 bg-card border border-gray-200 rounded-2xl p-1 shadow-xl dark:border-bg-secondary-dark dark:bg-bg-secondary-dark">
    {[
      { key: "posts", label: "Posts" },
      { key: "reading", label: "Reading List" },
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
        <h3 className="mb-2 mx-95">Your Published Posts Appear Here</h3>
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
        <h3 className="mb-2 mx-95">Your Reading Lists Appear Here</h3>
      </div>
    )}

    {activeTab === "archived" && (
      <div className="p-6 bg-card rounded-2xl border border-gray-200 shadow-xl dark:border-bg-secondary-dark">
        <h3 className="mb-2 mx-95">Your Archieved Posts Appear Here</h3>
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
        <h3 className="mb-2">Dashboard</h3>
        <p className="text-sm text-muted-foreground">
          Analytics, stats, and recent activity.
        </p>
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
  </div>
  </>
}

export default Profile