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
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import axiosInstance from "../../config/api";

function Settings() {
  const [activeTab, setActiveTab] = useState("account");
  const { theme, toggleTheme, font, changeFont } = useContext(ThemeContext);

  const [blockedUsers, setBlockedUsers] = useState([]);
  const [unblockingIds, setUnblockingIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const menuItems = [
    { id: "account", label: "Account", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
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
                  src="https://ui-avatars.com/api/?name=User&background=random"
                  className="w-20 h-20 rounded-2xl"
                  alt="Avatar"
                />
                <div>
                  <h4 className="font-bold text-lg dark:text-white">
                    Profile Picture
                  </h4>
                  <p className="text-sm text-slate-500">PNG, JPG max 10MB</p>
                </div>
                <button className="ml-auto bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold">
                  Change
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-500">
                    Display Name
                  </label>
                  <input
                    type="text"
                    className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Your Name"
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
                  />
                </div>
              </div>
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
          </div>
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
