import { Home, LayoutDashboard, Link } from "lucide-react";
import { NavLink } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-bg-primary-dark transition-all duration-300">
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Card Container */}
          <div className="relative bg-white dark:bg-bg-secondary-dark rounded-3xl shadow-xl p-8 md:p-16 border border-gray-100 dark:border-bg-secondary-dark">
            {/* Content */}
            <div className="relative text-center">
              {/* Tech Icon */}
              <div className="flex justify-center mb-8">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-linear-to-br from-primary to-text-light  flex items-center justify-center">
                  <Link className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>
              </div>

              {/* 404 Title */}
              <h1 className="text-8xl md:text-9xl mb-6 text-primary dark:text-text-light tracking-tight font-bold">
                404
              </h1>

              {/* Messages */}
              <div className="space-y-3 mb-12">
                <p
                  className="text-2xl md:text-3xl text-gray-800 dark:text-white"
                  style={{
                    fontWeight: 600,
                  }}
                >
                  Oops! This page doesn't exist.
                </p>
                <p
                  className="text-gray-600 dark:text-gray-300"
                  style={{
                    fontWeight: 500,
                  }}
                >
                  Let's get you back on track.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* Primary Button */}
                <NavLink to="/" className="w-full sm:w-auto">
                  <button
                    className="group w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3"
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    <Home className="w-5 h-5" />
                    Go Back Home
                  </button>
                </NavLink>
                {/* Secondary Button */}
                <button
                  className="group w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-text-light  text-text-dark  hover:text-white rounded-2xl hover:bg-text-light hover:bg-opacity-5 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3"
                  style={{
                    fontWeight: 600,
                  }}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  View Posts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
