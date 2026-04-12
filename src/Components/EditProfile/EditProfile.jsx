import React, { useState, useEffect } from "react";
import {
  Settings,
  X,
  Upload,
  BookOpen,
  Linkedin,
  Github,
  MapPin,
  Trash2,
  Loader2,
  Camera,
  Globe,
} from "lucide-react";
import axiosInstance from "../../config/api";

const EditProfile = ({
  showEditDialog,
  handleCancelEdit,
  handleSaveProfile,
  profileData,
  setProfileData,
  profileImage,
  coverImage,
  setProfileImage,
  setCoverImage,
  token,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedCover, setSelectedCover] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showEditDialog) {
      setAvatarPreview(profileImage);
      setCoverPreview(coverImage);
      setSelectedAvatar(null);
      setSelectedCover(null);
    }
  }, [showEditDialog, profileImage, coverImage]);

  if (!showEditDialog) return null;

  // 1. دالة رفع الصور
  const uploadImage = async (file, type) => {
    const isAvatar = type === "avatar";
    const endpoint = isAvatar
      ? "/profile/upload/avatar"
      : "/profile/upload/cover-image";

    const formData = new FormData();
    formData.append(isAvatar ? "avatar_url" : "cover_image", file);

    const response = await axiosInstance.post(endpoint, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return response.data.data;
  };

  // 2. دالة حفظ الحسابات الاجتماعية (API المنفصل)
  const saveSocialAccounts = async () => {
    const socialEndpoint = "/settings/social-accounts";
    const payload = {
      linkedin_url: profileData.linkedin || "",
      github_url: profileData.github || "",
      orcid_url: profileData.orcid || "",
    };

    await axiosInstance.post(socialEndpoint, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  };

  const onSave = async () => {
    setIsSubmitting(true);
    try {
      // رفع الأفاتار إذا تم اختياره
      if (selectedAvatar) {
        const result = await uploadImage(selectedAvatar, "avatar");
        setProfileImage(result.avatar_url || result);
      }

      // رفع الغلاف إذا تم اختياره
      if (selectedCover) {
        const result = await uploadImage(selectedCover, "cover");
        setCoverImage(result.cover_image || result);
      }

      // حفظ الحسابات الاجتماعية
      await saveSocialAccounts();

      // حفظ بيانات البروفايل الأساسية (الاسم، البايو، الخ)
      await handleSaveProfile();

      // alert("Profile and Social Accounts updated successfully! 🎉");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save changes. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size is too large (Max 2MB)");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      if (type === "avatar") {
        setSelectedAvatar(file);
        setAvatarPreview(previewUrl);
      } else {
        setSelectedCover(file);
        setCoverPreview(previewUrl);
      }
    }
  };

  // const removeImage = (type) => {
  //   if (type === "avatar") {
  //     setSelectedAvatar(null);
  //     setAvatarPreview(null);
  //   } else {
  //     setSelectedCover(null);
  //     setCoverPreview(null);
  //   }
  // };

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-bg-secondary-dark w-full max-w-175 max-h-[90vh] rounded-3xl shadow-2xl border-2 border-[#62b6cb]/20 flex flex-col"
        dir="ltr"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-[#1b4965] dark:text-gray-100 flex items-center gap-2">
              <Settings className="w-6 h-6 text-text-light dark:text-text-dark" />
              Edit Profile
            </h2>
            <p className="text-gray-500 text-sm mt-1 dark:text-gray-300">
              Manage your identity and social connections.
            </p>
          </div>
          <button
            onClick={handleCancelEdit}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-scroll no-scrollbar">
          {/* Cover Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-[#1b4965] dark:text-gray-200">
                Cover Image
              </label>
              {/* {coverPreview && (
                <button
                  onClick={() => removeImage("cover")}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1 text-xs font-medium"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              )} */}
            </div>
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#62b6cb]/20 h-42 group bg-gray-100 dark:bg-gray-800">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  className="w-full h-full object-cover"
                  alt="Cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Cover
                </div>
              )}
              <div
                onClick={() => document.getElementById("cover-input").click()}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer"
              >
                <Camera className="text-white w-8 h-8" />
              </div>
              <input
                id="cover-input"
                type="file"
                hidden
                onChange={(e) => onFileChange(e, "cover")}
                accept="image/*"
              />
            </div>
          </div>

          {/* Avatar Section */}
          <div className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
            <div className="relative group w-20 h-20 shrink-0">
              <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-white dark:border-gray-700 shadow-md bg-gray-200">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    className="w-full h-full object-cover"
                    alt="Avatar"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-400">
                    Empty
                  </div>
                )}
              </div>
              <div
                onClick={() => document.getElementById("avatar-input").click()}
                className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer"
              >
                <Upload className="text-white w-5 h-5" />
              </div>
              <input
                id="avatar-input"
                type="file"
                hidden
                onChange={(e) => onFileChange(e, "avatar")}
                accept="image/*"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-[#1b4965] dark:text-gray-200">
                Profile Picture
              </h4>
              <div className="flex gap-4 mt-1">
                <p className="text-xs text-gray-500">PNG, JPG (Max 2MB)</p>
                {/* {avatarPreview && (
                <button
                  onClick={() => removeImage("avatar")}
                  className="text-red-500 text-xs mt-1 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Remove image
                </button>
              )} */}
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name || ""}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-[#62b6cb]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">
                Username
              </label>
              <input
                type="text"
                value={profileData.username || ""}
                onChange={(e) =>
                  setProfileData({ ...profileData, username: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-[#62b6cb]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">
                Education
              </label>
              <input
                type="text"
                value={profileData.education || ""}
                onChange={(e) =>
                  setProfileData({ ...profileData, education: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-[#62b6cb]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">
                Location
              </label>
              <input
                type="text"
                value={profileData.location || ""}
                onChange={(e) =>
                  setProfileData({ ...profileData, location: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-[#62b6cb]"
              />
            </div>
          </div>

          {/* Bio, Education, Location... (باقي الحقول كما هي) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">
              Bio
            </label>
            <textarea
              rows="3"
              value={profileData.bio || ""}
              onChange={(e) =>
                setProfileData({ ...profileData, bio: e.target.value })
              }
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-[#62b6cb]"
            />
          </div>

          {/* Social Presence Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">
              Social Accounts
            </label>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-2xl border border-transparent focus-within:border-[#62b6cb] transition-all">
              <Linkedin className="w-5 h-5 text-blue-600 ml-2" />
              <input
                placeholder="LinkedIn URL"
                value={profileData.linkedin || ""}
                onChange={(e) =>
                  setProfileData({ ...profileData, linkedin: e.target.value })
                }
                className="bg-transparent flex-1 outline-none text-sm dark:text-white"
              />
            </div>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-2xl border border-transparent focus-within:border-[#62b6cb] transition-all">
              <Github className="w-5 h-5 text-gray-700 dark:text-gray-300 ml-2" />
              <input
                placeholder="GitHub URL"
                value={profileData.github || ""}
                onChange={(e) =>
                  setProfileData({ ...profileData, github: e.target.value })
                }
                className="bg-transparent flex-1 outline-none text-sm dark:text-white"
              />
            </div>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-2xl border border-transparent focus-within:border-[#62b6cb] transition-all">
              <Globe className="w-5 h-5 text-green-600 ml-2" />
              <input
                placeholder="ORCID URL"
                value={profileData.orcid || ""}
                onChange={(e) =>
                  setProfileData({ ...profileData, orcid: e.target.value })
                }
                className="bg-transparent flex-1 outline-none text-sm dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={handleCancelEdit}
            className="px-6 py-2 rounded-xl border border-gray-200 dark:text-white dark:border-gray-900 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-xl bg-primary text-white transition-all hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
