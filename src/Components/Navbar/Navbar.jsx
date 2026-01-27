import {
  Menu,
  X,
  PencilLine,
  Bell,
  UserRoundPen,
  Search,
  Code,
} from "lucide-react";
import { useState, useContext } from "react";
import LogoWhite from "../../assets/images/DevHubLogoBlack.png";
import LogoBlack from "../../assets/images/DevHubLogoWhite.png";
import DarkMode from "../NavbarLandingPage/DarkMode.jsx";
import { ThemeContext } from "../../context/ThemeContext";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

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
            <NavLink to="/home">
              <button className="text-[#0F172A] hover:text-text-light dark:text-gray-100 dark:hover:text-blue-400">
                Home
              </button>
            </NavLink>

            <NavLink to="/trending">
              <button className="text-[#0F172A] hover:text-text-light dark:text-gray-100 dark:hover:text-blue-400">
                Trending
              </button>
            </NavLink>

            <NavLink to="/qa">
              <button className="text-[#0F172A] hover:text-text-light dark:text-gray-100 dark:hover:text-blue-400">
                Q&A
              </button>
            </NavLink>

            <NavLink to="/aichat">
              <button className="text-[#0F172A] hover:text-text-light dark:text-gray-100 dark:hover:text-blue-400">
                AI Chat
              </button>
            </NavLink>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search icon (mobile) */}
            <button className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <Search
                size={18}
                strokeWidth={2.5}
                className="text-gray-700 dark:text-gray-100"
              />
            </button>

            {/* Search input (desktop) */}
            <div className="hidden lg:block">
              <div className="relative w-64">
                <Search
                  size={18}
                  strokeWidth={2.5}
                  className="absolute top-1/2 -translate-y-1/2 left-2.5 text-text-light"
                />
                <input
                  type="text"
                  className="w-full rounded-full py-1.5 border-2 text-bg-secondary-dark border-gray-200 bg-gray-100 pl-9 dark:bg-bg-primary-dark dark:text-gray-50 dark:border-gray-700 cursor-pointer text-sm"
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
              <Link to="/playground" className="dark:text-white text-gray-700">
                <Code size={20} strokeWidth={2} />
              </Link>

              <Link
                to="/notification"
                className="dark:text-white text-gray-700"
              >
                <Bell size={20} strokeWidth={2} />
              </Link>

              <DarkMode />

              <Link to="/profile">
                <div className="text-white bg-primary rounded-full p-2 overflow-hidden">
                  <UserRoundPen size={18} strokeWidth={3} />
                </div>
              </Link>
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
              <NavLink to="/home">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-[#0F172A] hover:bg-gray-100 rounded-md dark:text-gray-100 dark:hover:bg-gray-800 w-full"
                >
                  Home
                </button>
              </NavLink>

              <NavLink to="/trending">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-[#0F172A] hover:bg-gray-100 rounded-md dark:text-gray-100 dark:hover:bg-gray-800 w-full"
                >
                  Trending
                </button>
              </NavLink>

              <NavLink to="/qa">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-[#0F172A] hover:bg-gray-100 rounded-md dark:text-gray-100 dark:hover:bg-gray-800 w-full"
                >
                  Q&A
                </button>
              </NavLink>

              <NavLink to="/aichat">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-[#0F172A] hover:bg-gray-100 rounded-md dark:text-gray-100 dark:hover:bg-gray-800 w-full"
                >
                  AI Chat
                </button>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
