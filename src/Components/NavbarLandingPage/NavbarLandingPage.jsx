import { Menu, X } from "lucide-react";
import { useState, useContext } from "react";
import LogoWhite from "../../assets/images/DevHubLogoBlack.png";
import LogoBlack from "../../assets/images/DevHubLogoWhite.png";
import DarkMode from "./DarkMode.jsx";
import { ThemeContext } from "../../context/ThemeContext";
import { Link, NavLink } from "react-router-dom";

export function NavbarLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50
    dark:bg-gray-900/90 dark:shadow-xl transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection("home")}
          >
            {theme === "dark" ? (
              <img src={LogoBlack} className="w-32" />
            ) : (
              <img src={LogoWhite} className="w-32" />
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-[#0F172A] hover:text-text-light transition-all duration-200 dark:text-gray-100 dark:hover:text-blue-400 "
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-[#0F172A] hover:text-text-light transition-all duration-200 dark:text-gray-100 dark:hover:text-blue-400"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-[#0F172A] hover:text-text-light transition-all duration-200 dark:text-gray-100 dark:hover:text-blue-400"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-[#0F172A] hover:text-text-light transition-all duration-200 dark:text-gray-100 dark:hover:text-blue-400"
            >
              About
            </button>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Updated Register Button */}
            <Link to="/register">
              <button className="px-5 py-2 text-[#0F172A] hover:text-text-light transition-colors duration-200 dark:text-gray-100 dark:hover:text-blue-400">
                Register
              </button>
            </Link>

            <Link to="/login">
              <button className="px-6 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                Login Now
              </button>
            </Link>
            <div>
              <DarkMode />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <DarkMode />
            </div>
            <button
              className="md:hidden"
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-5 pb-4 flex flex-col gap-4">
            <button
              onClick={() => scrollToSection("home")}
              className="text-[#0F172A] hover:text-text-light transition-all duration-200 text-left dark:text-gray-100 dark:hover:text-blue-400 hover:translate-x-1"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-[#0F172A] hover:text-text-light transition-all duration-200 text-left dark:text-gray-100 dark:hover:text-blue-400 hover:translate-x-1"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-[#0F172A] hover:text-text-light transition-all duration-200 text-left dark:text-gray-100 dark:hover:text-blue-400 hover:translate-x-1"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-[#0F172A] hover:text-[#2563EB] transition-all duration-200 text-left dark:text-gray-100 dark:hover:text-blue-400 hover:translate-x-1"
            >
              About
            </button>
            <div className="flex flex-col gap-3 mt-4 border-t border-gray-300 dark:border-gray-600 pt-4">
              {/* Updated Mobile Register Button */}
              <Link to="/register">
                <button className="px-5 py-2 text-[#0F172A] hover:text-[#2563EB] transition-all duration-200 text-left dark:text-gray-100 dark:hover:text-blue-400 hover:-translate-y-1">
                  Register
                </button>
              </Link>

              <Link to="/login">
                <button className="px-6 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  Login Now
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}