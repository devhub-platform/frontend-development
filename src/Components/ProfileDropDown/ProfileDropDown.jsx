import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, History, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/api";

export default function ProfileDropDown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [imgLoading, setImgLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const token = localStorage.getItem("userToken");
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    if (!isLoggedIn) {
      setImgLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(data.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setImgLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axiosInstance.post(
        `/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("userToken");
      setIsLoggingOut(false);
      setOpen(false);
      navigate("/login");
    }
  };

  // لو مش لوجين — بيظهر زرار Login بدل الـ dropdown
  if (!isLoggedIn) {
    return (
      <button
        onClick={() => navigate("/login")}
        className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-text-light transition-colors"
      >
        Login
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-11.5 h-11 rounded-full bg-primary text-white flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all"
      >
        {userData?.avatar_url ? (
          <img
            src={userData.avatar_url}
            alt="profile"
            className="w-full h-full object-cover"
          />
        ) : imgLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <User size={20} strokeWidth={2.5} />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-300 dark:border-gray-800 z-50 overflow-hidden">
          <button
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <User size={16} /> Profile
          </button>

          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            <History size={16} /> History
          </button>

          <button
            onClick={() => {
              navigate("/settings");
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Settings size={16} /> Settings
          </button>

          <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            {isLoggingOut ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Logging out...
              </>
            ) : (
              <>
                <LogOut size={16} /> Logout
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
