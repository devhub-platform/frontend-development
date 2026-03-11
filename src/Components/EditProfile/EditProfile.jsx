import React, { useState } from "react";
import {
  Settings,
  X,
  Upload,
  BookOpen,
  Briefcase,
  Linkedin,
  Github,
  GraduationCap,
  MapPin,
} from "lucide-react";

const EditProfile = ({
  showEditDialog,
  handleCancelEdit,
  handleSaveProfile,
  profileData,
  setProfileData,
  profileImage,
  coverImage,
  tempProfileImage,
  tempCoverImage,
  handleProfileImageUpload,
  handleCoverImageUpload,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showEditDialog) return null;

  const onSave = async () => {
    setIsSubmitting(true);
    await handleSaveProfile();
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-bg-secondary-dark w-full max-w-175 max-h-[90vh] rounded-3xl shadow-2xl border-2 border-[#62b6cb]/20 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-[#1b4965] dark:text-gray-100 flex items-center gap-2">
              <Settings className="w-6 h-6 text-text-light dark:text-text-dark" />{" "}
              Edit Profile
            </h2>
            <p className="text-gray-500 text-sm mt-1 dark:text-gray-300">
              Update your profile information, images, and social media links.
            </p>
          </div>
          <button
            onClick={handleCancelEdit}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-scroll no-scrollbar">
          {/* Cover & Profile Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1b4965] dark:text-gray-200">
              Cover Image
            </label>
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#62b6cb]/20 h-42 group">
              <img
                src={tempCoverImage || coverImage}
                className="w-full h-full object-cover"
                alt="Cover"
              />
              <button
                onClick={() => document.getElementById("cover-input").click()}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-2 text-white">
                  <Upload className="w-6 h-6" />
                  <span className="text-sm">Upload Cover</span>
                </div>
              </button>
              <input
                id="cover-upload-modal"
                type="file"
                hidden
                onChange={handleCoverImageUpload}
                accept="image/*"
              />
            </div>
            <div className="space-y-2 border-b border-gray-200 dark:border-gray-700 p-4 my-4 pb-6">
              <label className="text-sm font-semibold text-[#1b4965] dark:text-gray-200">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="relative group w-24 h-24">
                  <img
                    src={tempProfileImage || profileImage}
                    className="w-full h-full rounded-2xl object-cover border-2 border-[#62b6cb]/20"
                    alt="Avatar preview"
                  />
                  <input
                    id="avatar-input"
                    type="file"
                    hidden
                    onChange={handleProfileImageUpload}
                    accept="image/*"
                  />
                </div>
                <div className="flex flex-col gap-2 justify-center mx-auto">
                  <button
                    onClick={() =>
                      document.getElementById("avatar-input").click()
                    }
                    className="px-4 py-2 border border-blue-100 rounded-xl hover:bg-blue-100 dark:hover:bg-bg-secondary-dark transition-colors text-sm font-medium
                            dark:border-blue-800/10 dark:bg-bg-primary-dark dark:text-gray-200 sm:min-w-120"
                  >
                    Upload New Picture
                  </button>
                  {/* {tempProfileImage && (
                    <button
                      //   onClick={() => setTempProfileImage(null)}
                      className="text-red-500 text-sm hover:underline text-left mt-2"
                    >
                      Remove temporary image
                    </button>
                  )} */}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#62b6cb] outline-none dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">
                Username
              </label>
              <input
                type="text"
                value={profileData.username}
                onChange={(e) =>
                  setProfileData({ ...profileData, username: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#62b6cb] outline-none dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">
              Bio
            </label>
            <textarea
              rows="3"
              value={profileData.bio}
              onChange={(e) =>
                setProfileData({ ...profileData, bio: e.target.value })
              }
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#62b6cb] outline-none  min-h-25 dark:bg-gray-800 dark:border-gray-700"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">
                Education
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={profileData.education}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      education: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#62b6cb] outline-none dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) =>
                    setProfileData({ ...profileData, location: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#62b6cb] outline-none dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-[#1b4965] dark:text-gray-200">
              Social Presence
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-2xl">
                <Linkedin className="w-5 h-5 text-blue-600 ml-2" />
                <input
                  type="text"
                  placeholder="LinkedIn username"
                  value={profileData.linkedin}
                  onChange={(e) =>
                    setProfileData({ ...profileData, linkedin: e.target.value })
                  }
                  className="bg-transparent flex-1 outline-none text-sm dark:text-white"
                />
              </div>
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-2xl">
                <Github className="w-5 h-5 text-gray-800 dark:text-white ml-2" />
                <input
                  type="text"
                  placeholder="GitHub username"
                  value={profileData.github}
                  onChange={(e) =>
                    setProfileData({ ...profileData, github: e.target.value })
                  }
                  className="bg-transparent flex-1 outline-none text-sm dark:text-white"
                />
              </div>
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-2xl">
                <GraduationCap className="w-5 h-5 text-red-600 ml-2" />
                <input
                  type="text"
                  placeholder="Scholar ID"
                  value={profileData.scholar}
                  onChange={(e) =>
                    setProfileData({ ...profileData, scholar: e.target.value })
                  }
                  className="bg-transparent flex-1 outline-none text-sm dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={handleCancelEdit}
            className="px-6 py-2 rounded-xl border border-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors font-medium
                  dark:bg-gray-900 dark:border-0"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-xl bg-primary text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex items-center gap-2 font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
