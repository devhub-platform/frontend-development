import React, { useState } from "react";
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
} from "lucide-react";
import axios from "axios";

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
  const [uploadingType, setUploadingType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSave = async () => {
    setIsSubmitting(true);
    await handleSaveProfile();
    setIsSubmitting(false);
  };

  if (!showEditDialog) return null;

  const internalImageUpload = async (file, type) => {
    const isAvatar = type === "avatar";
    const endpoint = isAvatar
      ? "https://api.dev-hubs.tech/api/v1/profile/upload/avatar"
      : "https://api.dev-hubs.tech/api/v1/profile/upload/cover-image";

    const formData = new FormData();

    // التعديل الجذري هنا:
    // السيرفر أظهر خطأ باسم avatar_url، لذا سنرسل الملف بهذا الاسم للأفاتار
    if (isAvatar) {
      formData.append("avatar_url", file);
    } else {
      formData.append("cover_image", file);
    }

    try {
      setUploadingType(type);
      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // استخراج الرابط الجديد بناءً على هيكلة الـ API الخاصة بك
      const result = response.data.data;
      const newUrl = isAvatar
        ? result.avatar_url || result
        : result.cover_image || result;

      if (isAvatar) setProfileImage(newUrl);
      else setCoverImage(newUrl);

      alert("تم رفع الصورة بنجاح! 🎉");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        console.error("Validation Details:", errors);
        const errorMessages = Object.values(errors).flat().join("\n");
        alert(`فشل الرفع بسبب:\n${errorMessages}`);
      } else {
        console.error("Upload error:", error);
        alert("حدث خطأ غير متوقع أثناء الرفع.");
      }
    } finally {
      setUploadingType(null);
    }
  };

  const onFileChange = async (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 2 ميجابايت.");
        return;
      }
      await internalImageUpload(file, type);
    }
  };

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
          {/* Cover Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1b4965] dark:text-gray-200">
              Cover Image
            </label>
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#62b6cb]/20 h-42 group">
              <img
                src={
                  coverImage ||
                  `https://ui-avatars.com/api/?name=${profileData.name}&background=003890&color=fff`
                }
                className="w-full h-full object-cover"
                alt="Cover"
              />
              <div
                onClick={() =>
                  !uploadingType &&
                  document.getElementById("cover-input").click()
                }
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
              >
                {uploadingType === "cover" ? (
                  <Loader2 className="text-white animate-spin" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-white">
                    <Upload className="w-8 h-8" />
                    <span className="text-sm">Upload Cover</span>
                  </div>
                )}
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
              <img
                src={
                  profileImage ||
                  `https://ui-avatars.com/api/?name=${profileData.name}&background=random`
                }
                className="w-full h-full rounded-2xl object-cover border-2 border-white dark:border-gray-700 shadow-md"
                alt="Avatar"
              />
              <div
                onClick={() =>
                  !uploadingType &&
                  document.getElementById("avatar-input").click()
                }
                className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer"
              >
                {uploadingType === "avatar" ? (
                  <Loader2 className="text-white animate-spin" />
                ) : (
                  <Upload className="text-white w-5 h-5" />
                )}
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
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG or JPEG (Max 2MB)
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#62b6cb] outline-none dark:bg-gray-800 dark:border-gray-700"
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
              value={profileData.bio || ""}
              onChange={(e) =>
                setProfileData({ ...profileData, bio: e.target.value })
              }
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#62b6cb] outline-none  min-h-25 dark:bg-gray-800 dark:border-gray-700"
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
                  value={profileData.education || ""}
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={profileData.location || ""}
                  onChange={(e) =>
                    setProfileData({ ...profileData, location: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#62b6cb] outline-none dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <label className="text-sm font-medium text-[#1b4965] dark:text-gray-200">
              Social Presence
            </label>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-2xl">
              <Linkedin className="w-5 h-5 text-blue-600 ml-2" />
              <input
                placeholder="LinkedIn Username"
                value={profileData.linkedin || ""}
                onChange={(e) =>
                  setProfileData({ ...profileData, linkedin: e.target.value })
                }
                className="bg-transparent flex-1 outline-none text-sm dark:text-white"
              />
            </div>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-2xl">
              <Github className="w-5 h-5 text-gray-400" />
              <input
                placeholder="GitHub Username"
                value={profileData.github || ""}
                onChange={(e) =>
                  setProfileData({ ...profileData, github: e.target.value })
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
            className="px-6 py-2 rounded-xl border border-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors font-medium dark:bg-gray-900 dark:border-0"
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
