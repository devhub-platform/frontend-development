import { ArrowRight } from "lucide-react";
import heroImage from "../../assets/images/generatedimage.png";
import { Link, NavLink } from "react-router-dom";

export function Hero() {

  return (
    <section
      id="home"
      className="
        pt-32 pb-20 
        bg-linear-to-br from-[#F8FAFC] via-white to-blue-50
        dark:from-bg-secondary-dark dark:via-bg-secondary-dark dark:to-primary
        transition-all duration-300 min-h-screen flex items-center
      "
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div className="space-y-8">
            <div className="space-y-6">
              {/* TITLE */}
              <h1
                className="
                  text-[#0F172A]
                  dark:text-white
                "
                style={{
                  fontWeight: 800,
                  fontSize: "3.5rem",
                  lineHeight: "1.1",
                }}
              >
                Your AI-Powered Knowledge Community
              </h1>

              {/* SUBTEXT */}
              <p
                className="
                  text-[#475569] 
                  dark:text-gray-400
                "
                style={{
                  fontWeight: 400,
                  fontSize: "1.25rem",
                  lineHeight: "1.6",
                }}
              >
                Write, learn, connect, and create with built-in AI tools that
                enhance your content and boost productivity.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <NavLink to="/home">
                <button
                  className="
                  px-8 py-4 
                  bg-primary text-white 
                  rounded-lg 
                  hover:shadow-xl 
                  transition-all duration-300 hover:-translate-y-1 
                  flex items-center justify-center gap-2
                "
                  style={{ fontWeight: 600 }}
                >
                  Join the Community
                  <ArrowRight className="w-5 h-5" />
                </button>
              </NavLink>

              <a href="#about">
                <button
                  className="
                  px-8 py-4 
                  bg-white text-primary
                  border-2 border-primary
                  rounded-lg 
                  hover:shadow-xl 
                  transition-all duration-300 hover:-translate-y-1

                  dark:bg-gray-800 
                  dark:text-blue-400 
                  dark:border-text-light
                  dark:hover:bg-gray-700
                "
                  style={{ fontWeight: 600 }}
                >
                  Learn More
                </button>
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div>
                <div
                  className="text-text-light dark:text-text-dark"
                  style={{
                    fontWeight: 800,
                    fontSize: "2rem",
                  }}
                >
                  10K+
                </div>
                <div
                  className="text-[#64748B] dark:text-gray-400"
                  style={{ fontWeight: 500 }}
                >
                  Active Developers
                </div>
              </div>

              <div>
                <div
                  className="text-text-light dark:text-text-dark"
                  style={{
                    fontWeight: 800,
                    fontSize: "2rem",
                  }}
                >
                  50K+
                </div>
                <div
                  className="text-[#64748B] dark:text-gray-400"
                  style={{ fontWeight: 500 }}
                >
                  Posts Created
                </div>
              </div>

              <div>
                <div
                  className="text-text-light dark:text-text-dark"
                  style={{
                    fontWeight: 800,
                    fontSize: "2rem",
                  }}
                >
                  AI
                </div>
                <div
                  className="text-[#64748B] dark:text-gray-400"
                  style={{ fontWeight: 500 }}
                >
                  Powered Tools
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="relative">
            <div
              className="
              relative rounded-2xl overflow-hidden shadow-2xl 
              hover:shadow-3xl hover:scale-102 transition-all duration-300
              dark:shadow-blue-500/20
            "
            >
              <img
                src={heroImage}
                alt="AI-powered workspace"
                className="w-full h-120 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
