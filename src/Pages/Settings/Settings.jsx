import React, { useState, useContext, useEffect } from "react";
import {
  User,
  Lock,
  Bell,
  Shield,
  Moon,
  Monitor,
  LogOut,
  ChevronRight,
  Globe,
  Settings as SettingsIcon,
  Palette,
  Trash2,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/api";
import OtpInput from "react-otp-input";

function Settings() {
  const [activeTab, setActiveTab] = useState("account");
  const { theme, toggleTheme, font, changeFont } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    alt_email: "",
  });
    const [profileImage, setProfileImage] = useState(null);

    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) return;
        const { data } = await axiosInstance.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profile = data.data; // حسب شكل الـ Response بتاع السيرفر بتاعك
        setProfileData({
          name: profile.name || "",
          username: profile.username || "",
          email: profile.email || "",
          bio: profile.bio || "",
          alt_email: profile.alt_email || "",
        });

        setProfileImage(profile.avatar_url);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    const [altEmail, setAltEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState("input"); // 'input' أو 'verify'
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isMakingPrimary, setIsMakingPrimary] = useState(false);

    const handleSendOtp = async () => {
      setIsSendingOtp(true);
      try {
        const token = localStorage.getItem("userToken");
        const response = await axiosInstance.post("/settings/alt-email/send-otp", 
      { alt_email: altEmail },
      { headers: { Authorization: `Bearer ${token}` } }
    );
        alert(response.data.message);
        setStep("verify");
      } catch (error) {
        console.error("Error sending OTP:", error);
        alert(error.response?.data?.message || "Failed to send OTP");
      } finally {
        setIsSendingOtp(false);
      }
    };

    const handleResendOtp = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await axiosInstance.post(
          "/settings/alt-email/send-reset-otp",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        alert(response.data.message);
      } catch (error) {
        alert("Error resending code");
        console.log("Error resending OTP:", error);
      }
    };

    const handleVerifyOtp = async (e) => {
      e.preventDefault();
      setIsVerifying(true);
      try {
        const token = localStorage.getItem("userToken");
        await axiosInstance.post(
          "/settings/alt-email/verify-otp",
          { otp },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        alert("Alternative email verified successfully!");
        setStep("input");
        setAltEmail("");
        setOtp("");
        fetchProfileData(); // لتحديث البيانات وعرض الايميل الجديد
      } catch (error) {
        alert(error.response?.data?.message || "Invalid OTP");
      } finally {
        setIsVerifying(false);
      }
    };

    const handleMakePrimary = async () => {
      setIsMakingPrimary(true);
      try {
        const token = localStorage.getItem("userToken");
        const response = await axiosInstance.post(
          "/settings/alt-email/make-as-primary",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        alert("Success! Your alternative email is now your primary email.");
        fetchProfileData();
      } catch (error) {
        alert(
          error.response?.data?.message || "Failed to update primary email.",
        );
      } finally {
        setIsMakingPrimary(false);
      }
    };

    const handleDeleteAltEmail = async () => {
      if (!window.confirm("Are you sure you want to remove your alternative email?")) return;
      const token = localStorage.getItem("userToken");
      try {
        await axiosInstance.delete("/settings/alt-email/remove", {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Alternative email removed successfully!");
        fetchProfileData();
      } catch (error) {
        console.log("Error removing alternative email:", error);
        alert("Error removing alternative email");
      }
    };

  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const handleDeleteAccount = async () => {
    const confirmFirst = window.confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.");
    if (!confirmFirst) return;

    const confirmSecond = window.prompt("To confirm deletion, please type 'DELETE' in the box below:");
    if (confirmSecond !== "DELETE") {
      alert("Confirmation failed. Account was not deleted.");
      return;
    }
    setIsDeletingAccount(true);

    try {
      const token = localStorage.getItem("userToken");
      await axiosInstance.post("/settings/force/delete-account", {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
      alert("Your account has been deleted permanently. We're sorry to see you go.");
      localStorage.removeItem("userToken");
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const [passwords, setPasswords] = useState({
  current_password: "",
  new_password: "",
  new_password_confirmation: "",
});
const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if(passwords.new_password !== passwords.new_password_confirmation) {
      alert("New password and confirmation do not match.");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const token = localStorage.getItem("userToken");
      const response = await axiosInstance.patch("/settings/update-password", passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Password updated:", response.data);
      alert("Password updated successfully!");
      setPasswords({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem("userToken");
      await axiosInstance.post(
        `/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("userToken");
      setIsLoggingOut(false);
      navigate("/login");
    }
  };

  const [blockedUsers, setBlockedUsers] = useState([]);
  const [unblockingIds, setUnblockingIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportedUsers, setReportedUsers] = useState([]);

  const menuItems = [
    { id: "account", label: "Account", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "privacy", label: "Privacy & Safety", icon: Shield },
    { id: "system", label: "System", icon: Monitor },
  ];

  const fontOptions = [
    {
      id: "font-playfair",
      name: "Playfair Display",
      desc: "Traditional, have feet.",
      class: "font-playfair",
    },
    {
      id: "font-inter",
      name: "Inter Sans",
      desc: "Modern, feet free.",
      class: "font-inter",
    },
    {
      id: "font-poppins",
      name: "Poppins",
      desc: "Elegant, a bit more decorative.",
      class: "font-poppins",
    },
    {
      id: "font-mono",
      name: "Roboto Mono",
      desc: "Decorative, good for coding.",
      class: "font-mono",
    },
  ];

  const fetchBlockedUsers = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem("userToken");
        const response = await axiosInstance.get("/reports/blocked-users", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setBlockedUsers(data.data);
    } catch (error) {
        console.error("Error fetching blocked users:", error);
    } finally {
        setLoading(false);
    }
};

  const fetchReportedUsers = async () => {
    setLoading(true);
    try{
      const token = localStorage.getItem("userToken");
      const response = await axiosInstance.get("/reports/reported-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setReportedUsers(data.data);
    } catch (error) {
        console.error("Error fetching reported users:", error);
    } finally {
        setLoading(false);
    }
};

    const handleUnblock = async (userId) => {
        setUnblockingIds((prev) => [...prev, userId]);
        try {
            const token = localStorage.getItem("userToken");
            await axiosInstance.post(`/reports/unblock/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBlockedUsers((prev) => prev.filter((user) => user.id !== userId));
        } catch (error) {
            console.error("Error unblocking user:", error);
        } finally {            
            setUnblockingIds((prev) => prev.filter((id) => id !== userId));
        }
    };

    useEffect(() => {
        if (activeTab === "privacy") {
            fetchBlockedUsers();
            fetchReportedUsers();
        } else if (activeTab === "account") {
          fetchProfileData();
        }
    }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-black dark:text-white">
              Account Settings
            </h2>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <img
                  src={
                    profileImage ||
                    `https://ui-avatars.com/api/?name=${profileData.name || "User"}&background=random`
                  }
                  className="w-20 h-20 rounded-2xl"
                  alt={profileData.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${profileData.name}&background=random`;
                  }}
                />
                <div>
                  <h4 className="font-bold text-lg dark:text-white">
                    {profileData.name}
                  </h4>
                  <p className="text-sm text-slate-500">{profileData.bio}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-500">
                    Display Username
                  </label>
                  <input
                    type="text"
                    className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Your Name"
                    disabled
                    value={profileData.username}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-500">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                    placeholder="email@example.com"
                    disabled
                    value={profileData.email}
                  />
                </div>
                {profileData.alt_email ? (
                  <div className="grid gap-2 relative">
                    <label className="text-sm font-bold text-slate-500">
                      Alternative Email
                    </label>
                    <input
                      type="email"
                      className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                      placeholder="alt@example.com"
                      disabled
                      value={profileData.alt_email}
                    />
                    <div>
                      <button
                        type="button"
                        onClick={handleDeleteAltEmail}
                        className="text-sm font-bold text-red-500 hover:text-red-700 absolute top-10 right-5"
                      >
                        <Trash2 size={16} className="inline" />
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h4 className="text-2xl font-black dark:text-white">
                Alternative Email
              </h4>

              {/* 1. لو المستخدم عنده إيميل بديل متأكد (Verified) - نعرض زرار التحويل */}
              {profileData?.alt_email && step === "input" ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                        Verified Alternative
                      </label>
                      <p className="text-lg font-bold dark:text-white">
                        {profileData.alt_email}
                      </p>
                    </div>

                    <button
                      onClick={handleMakePrimary}
                      disabled={isMakingPrimary}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isMakingPrimary ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Make as Primary"
                      )}
                    </button>
                  </div>
                  <p className="mt-4 text-[10px] text-slate-400 italic">
                    * This will swap your primary email with this one.
                  </p>
                </div>
              ) : /* 2. حالة إدخال إيميل جديد */
              step === "input" ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <label className="text-sm font-bold text-slate-500 mb-3 block">
                    Add Alternative Email
                  </label>
                  <div className="flex flex-col md:flex-row gap-3">
                    <input
                      type="email"
                      value={altEmail}
                      onChange={(e) => setAltEmail(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                      placeholder="devhub@gmail.com"
                    />
                    <button
                      onClick={handleSendOtp}
                      disabled={!altEmail || isSendingOtp}
                      className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                      {isSendingOtp ? "Sending..." : "Add Email"}
                    </button>
                  </div>
                </div>
              ) : (
                /* 3. حالة إدخال الـ OTP */
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <p className="text-sm text-text-light dark:text-text-dark">
                        Code sent to <b>{altEmail}</b>
                      </p>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Resend Code
                      </button>
                    </div>

                    <div className="flex flex-col items-center gap-6 py-4">
                      <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderInput={(props) => (
                          <input
                            {...props}
                            className="w-10! h-12 md:w-12! md:h-14 mx-1 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary dark:focus:border-primary/50 rounded-xl text-xl font-black outline-none transition-all dark:text-white shadow-sm text-center"
                          />
                        )}
                      />

                      <div className="flex w-full gap-3">
                        <button
                          type="button"
                          onClick={() => setStep("input")}
                          className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isVerifying || otp.length < 6}
                          className="flex-2 bg-primary text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
                        >
                          {isVerifying ? "Verifying..." : "Verify & Save"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
            {/* Danger Zone */}
            <div className="pt-10 mt-10 border-t border-red-100 dark:border-red-900/20">
              <div className="flex items-center gap-2 mb-6">
                <div>
                  <h4 className="text-2xl font-black text-red-600 dark:text-red-400">
                    Danger Zone
                  </h4>
                  <p className="text-xs text-slate-500 font-medium font-inter">
                    Irreversible and destructive actions
                  </p>
                </div>
              </div>

              <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-md">
                  <h5 className="font-bold text-red-700 dark:text-red-400 mb-1">
                    Delete Account
                  </h5>
                  <p className="text-sm text-red-600/70 dark:text-red-400/60 leading-relaxed">
                    Once you delete your account, there is no going back. All
                    your posts, data, and interactions on DevHub will be
                    permanently removed.
                  </p>
                </div>

                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount}
                  className="whitespace-nowrap px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-red-200 dark:shadow-none hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeletingAccount ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "DELETE ACCOUNT"
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-black dark:text-white">
              Security Settings
            </h2>

            {/* Change Password Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Lock size={20} className="text-blue-500" />
                </div>
                <h4 className="font-bold text-lg dark:text-white">
                  Update Password
                </h4>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-500">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    value={passwords.current_password}
                    onChange={handlePasswordChange}
                    required
                    className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-bold text-slate-500">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="new_password"
                      value={passwords.new_password}
                      onChange={handlePasswordChange}
                      required
                      className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                      placeholder="Min. 8 characters"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-bold text-slate-500">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="new_password_confirmation"
                      value={passwords.new_password_confirmation}
                      onChange={handlePasswordChange}
                      required
                      className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className={`w-full md:w-auto px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 
    ${isUpdatingPassword ? "bg-slate-400 cursor-not-allowed" : "bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/20"}`}
                  >
                    {isUpdatingPassword ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      "Save New Password"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone / Logout */}
            <div className="bg-red-50/50 dark:bg-red-900/10 rounded-3xl p-6 border border-red-100 dark:border-red-900/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <LogOut size={18} /> Logout from DevHub
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Are you sure you want to log out? You will need to log in
                    again to access your account.
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm flex items-center gap-2
    ${
      isLoggingOut
        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
        : "bg-white dark:bg-slate-900 text-red-600 border border-red-200 dark:border-red-900/50 hover:bg-red-600 hover:text-white"
    }`}
                >
                  {isLoggingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
                      Logging out...
                    </>
                  ) : (
                    "Logout"
                  )}
                </button>
              </div>
            </div>

            {/* Additional Security Info */}
            <div className="bg-slate-100 dark:bg-slate-800/40 rounded-2xl p-4 flex items-start gap-3">
              <Shield size={18} className="text-slate-400 mt-0.5" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Your account security is important. Make sure to use a strong
                password with at least 8 characters, including numbers and
                special symbols.
              </p>
            </div>
          </div>
        );
      case "appearance":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 ml-8 w-full">
            <h2 className="text-2xl font-black dark:text-white">Theme Color</h2>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-bold dark:text-white">Dark Mode</h4>
                <p className="text-sm text-slate-500">
                  Adjust how DevHub looks to you
                </p>
              </div>
              <div
                className="w-12 h-6 bg-gray-200 dark:bg-primary rounded-full relative cursor-pointer transition-all duration-800"
                onClick={toggleTheme}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-700 ease-in-out ${
                    theme === "dark" ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </div>
            </div>
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <h2 className="text-2xl font-black dark:text-white">
                  Font Style
                </h2>
              </div>

              {/* الجريد اللي زي الصورة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-xl">
                {fontOptions.map((f, index) => (
                  <div
                    key={f.id}
                    onClick={() => changeFont(f.class)}
                    className={`relative p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group
                ${font === f.class ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}
                ${index === 0 ? "border-r border-b border-slate-200 dark:border-slate-800" : ""}
                ${index === 1 ? "border-b border-slate-200 dark:border-slate-800" : ""}
                ${index === 2 ? "border-r border-slate-200 dark:border-slate-800" : ""}
            `}
                  >
                    {/* علامة الاختيار بتظهر لما تختار الخط */}
                    {font === f.class && (
                      <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>
                    )}

                    <h3
                      className={`text-2xl md:text-3xl mb-4 dark:text-white transition-transform group-hover:scale-105 ${f.class}`}
                    >
                      {f.name}
                    </h3>
                    <p
                      className={`text-slate-400 text-sm font-medium leading-relaxed ${f.class}`}
                    >
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Preview Box - عشان اليوزر يشوف الخط شغال إزاي في الكلام الكتير */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className={`text-lg dark:text-slate-300 ${font}`}>
                  "Turn Your Wounds Into Wisdom" - Select your preferred font
                  style for the entire platform.
                </p>
              </div>
            </div>
          </div>
        );
      case "privacy":
        return (
          <>
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-black dark:text-white">
                Blocked Users
              </h2>

              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="mb-6">
                  <p className="text-sm text-slate-500">
                    Manage the people you've previously blocked.
                  </p>
                </div>

                {loading ? (
                  <div className="py-10 text-center text-slate-400">
                    Loading users...
                  </div>
                ) : blockedUsers.length > 0 ? (
                  <div className="space-y-4">
                    {blockedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              user.avatar ||
                              `https://ui-avatars.com/api/?name=${user.name}`
                            }
                            className="w-12 h-12 rounded-xl object-cover"
                            alt={user.name}
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=random`;
                            }}
                          />
                          <div>
                            <h5 className="font-bold text-sm dark:text-white">
                              {user.name}
                            </h5>
                            <p className="text-xs text-slate-500">
                              @{user.username}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleUnblock(user.id)}
                          disabled={unblockingIds.includes(user.id)}
                          className={`min-w-25 flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold transition-all
    ${
      unblockingIds.includes(user.id)
        ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
        : "bg-white dark:bg-slate-900 text-red-500 border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20"
    }`}
                        >
                          {unblockingIds.includes(user.id) ? (
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                              <span>Unblocking...</span>
                            </div>
                          ) : (
                            "Unblock"
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                    <p className="text-slate-400 text-sm italic">
                      No blocked users found.
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-black dark:text-white">
                  Reported Users
                </h2>

                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="mb-6">
                    <p className="text-sm text-slate-500">
                      The people who you have reported already blocked
                      automatically.
                    </p>
                  </div>

                  {loading ? (
                    <div className="py-10 text-center text-slate-400">
                      Loading users...
                    </div>
                  ) : reportedUsers.length > 0 ? (
                    <div className="space-y-4">
                      {reportedUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={
                                user.avatar ||
                                `https://ui-avatars.com/api/?name=${user.name}`
                              }
                              className="w-12 h-12 rounded-xl object-cover"
                              alt={user.name}
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=random`;
                              }}
                            />
                            <div>
                              <h5 className="font-bold text-sm dark:text-white">
                                {user.name}
                              </h5>
                              <p className="text-xs text-slate-500">
                                @{user.username}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                      <p className="text-slate-400 text-sm italic">
                        No reported users found.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        );
      default:
        return (
          <div className="text-slate-500 py-20 text-center">
            Section under development...
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex overflow-hidden">
      {/* --- Sidebar (Left) --- */}
      <div className="w-64 md:w-80 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 flex flex-col p-4 space-y-2 mt-2">
        <div className="px-4 mb-6">
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <SettingsIcon size={20} className="text-primary" /> Settings
          </h1>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-300 ${
                activeTab === item.id
                  ? "bg-primary/10 text-primary dark:bg-primary/20"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <item.icon
                size={20}
                strokeWidth={activeTab === item.id ? 2.5 : 2}
              />
              <span className="text-sm">{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* --- Content Area (Right) --- */}
      <main className="flex-1 overflow-y-auto p-8 md:p-12 mt-5 md:mt-5">
        <div className="max-w-3xl">{renderContent()}</div>
      </main>
    </div>
  );
}

export default Settings;
