import { Menu, X, PencilLine, Bell, Search, Code } from "lucide-react";
import { useState, useContext } from "react";
import LogoWhite from "../../assets/images/DevHubLogoBlack.png";
import LogoBlack from "../../assets/images/DevHubLogoWhite.png";
import DarkMode from "../NavbarLandingPage/DarkMode.jsx";
import ProfileDropDown from "../ProfileDropDown/ProfileDropDown.jsx";
import { ThemeContext } from "../../context/ThemeContext";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

  // Helper function عشان م نكررش الكود في كل NavLink
  // بتضيف ستايل "نشط" مختلف للديسك توب والموبايل
  const activeStyle = ({ isActive }) =>
    isActive
      ? "text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 dark:border-blue-400 pb-1 transition-all duration-200"
      : "text-[#0F172A] hover:text-blue-500 dark:text-gray-100 dark:hover:text-blue-400 transition-all duration-200";

  const mobileActiveStyle = ({ isActive }) =>
    isActive
      ? "px-3 py-2 bg-blue-50 text-blue-600 rounded-md dark:bg-gray-800 dark:text-blue-400 w-full font-bold text-left"
      : "px-3 py-2 text-[#0F172A] hover:bg-gray-100 rounded-md dark:text-gray-100 dark:hover:bg-gray-800 w-full text-left";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 dark:bg-gray-900/90 dark:shadow-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* LEFT SIDE: Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            {theme === "dark" ? (
              <img src={LogoBlack} className="w-28 md:w-32" alt="Logo" />
            ) : (
              <img src={LogoWhite} className="w-28 md:w-32" alt="Logo" />
            )}
          </div>

          {/* CENTER NAV — Desktop only (lg+) */}
          <div className="hidden lg:flex items-center gap-6 lg:gap-8">
            <NavLink to="/home" className={activeStyle}>
              Home
            </NavLink>

            <NavLink to="/trending" className={activeStyle}>
              Trending
            </NavLink>

            <NavLink to="/qa" className={activeStyle}>
              Q&A
            </NavLink>

            <NavLink to="/aichat" className={activeStyle}>
              AI Chat
            </NavLink>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search input (desktop) */}
            <div className="hidden lg:block">
              <div className="relative w-64">
                <Search
                  size={18}
                  strokeWidth={2.5}
                  className="absolute top-1/2 -translate-y-1/2 left-2.5 text-gray-400"
                />
                <input
                  type="text"
                  className="w-full rounded-full py-1.5 border-2 text-bg-secondary-dark border-gray-200 bg-gray-100 pl-9 dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700 cursor-pointer text-sm"
                  placeholder="Search..."
                  disabled
                />
              </div>
            </div>

            {/* Write button */}
            <Link to="/write">
              <button className="flex px-4 md:px-5 py-2 bg-primary text-white rounded-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 items-center gap-2">
                <PencilLine size={16} strokeWidth={2} />
                <span className="hidden md:inline-block font-semibold text-sm">
                  Write
                </span>
              </button>
            </Link>

            {/* Icons */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                to="/playground"
                className="dark:text-white text-gray-700 hover:text-blue-500"
              >
                <Code size={20} strokeWidth={2} />
              </Link>

              <Link
                to="/notification"
                className="dark:text-white text-gray-700 hover:text-blue-500"
              >
                <Bell size={20} strokeWidth={2} />
              </Link>

              <DarkMode />
              <ProfileDropDown />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#0F172A] dark:text-gray-100" />
              ) : (
                <Menu className="w-6 h-6 text-[#0F172A] dark:text-gray-100" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-5 fade-in duration-200">
            <div className="flex flex-col gap-1">
              <NavLink
                to="/home"
                className={mobileActiveStyle}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>

              <NavLink
                to="/trending"
                className={mobileActiveStyle}
                onClick={() => setMobileMenuOpen(false)}
              >
                Trending
              </NavLink>

              <NavLink
                to="/qa"
                className={mobileActiveStyle}
                onClick={() => setMobileMenuOpen(false)}
              >
                Q&A
              </NavLink>

              <NavLink
                to="/aichat"
                className={mobileActiveStyle}
                onClick={() => setMobileMenuOpen(false)}
              >
                AI Chat
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
