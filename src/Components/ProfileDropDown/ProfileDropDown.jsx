import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileDropDown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log("logout");
    // logout logic here
  };

  return (
    <div className="relative" ref={ref}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center"
      >
        <User size={18} strokeWidth={2.5} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-300 dark:border-gray-800 z-50 overflow-hidden">
          <button
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <User size={16} />
            Profile
          </button>

          <button
            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <History size={16} />
            History
          </button>

          <button
            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Settings size={16} />
            Settings
          </button>

          <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
