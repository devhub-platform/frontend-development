import aboutImage from "../../assets/images/teamimage.png";

export function About() {
  return (
    <section
      id="about"
      className="py-24 bg-white dark:bg-gray-800 transition-all duration-300 min-h-screen flex items-center"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left - Text */}
          <div className="space-y-6">
            <div
              className="inline-block px-4 py-2 bg-blue-50 text-text-light
              dark:bg-blue-900/50 dark:text-text-dark rounded-full"
            >
              About DevHub
            </div>

            <h2
              className="text-[#0F172A] dark:text-white"
              style={{
                fontWeight: 800,
                fontSize: "3rem",
                lineHeight: "1.1",
              }}
            >
              What is DevHub?
            </h2>

            <p
              className="text-[#475569] dark:text-gray-400"
              style={{
                fontWeight: 400,
                fontSize: "1.125rem",
                lineHeight: "1.7",
              }}
            >
              DevHub is a collaborative platform for developers and tech
              enthusiasts. Create posts, interact with others, and use powerful
              AI assistants to improve your writing, generate ideas, and produce
              visuals.
            </p>

            <p
              className="text-[#475569] dark:text-gray-400"
              style={{
                fontWeight: 400,
                fontSize: "1.125rem",
                lineHeight: "1.7",
              }}
            >
              Whether you're sharing tutorials, discussing new technologies, or
              building your personal brand, DevHub provides the tools and
              community to help you succeed.
            </p>

            {/* Stats */}
            <div className="flex gap-4 pt-4">
              <div className="flex-1 p-6 bg-[#F8FAFC] dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <div
                  className="text-text-light dark:text-text-dark"
                  style={{
                    fontWeight: 800,
                    fontSize: "2rem",
                  }}
                >
                  100%
                </div>
                <div
                  className="text-[#64748B] dark:text-gray-400"
                  style={{ fontWeight: 500 }}
                >
                  Free to Start
                </div>
              </div>

              <div className="flex-1 p-6 bg-[#F8FAFC] dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <div
                  className="text-text-light dark:text-text-dark"
                  style={{
                    fontWeight: 800,
                    fontSize: "2rem",
                  }}
                >
                  24/7
                </div>
                <div
                  className="text-[#64748B] dark:text-gray-400"
                  style={{ fontWeight: 500 }}
                >
                  AI Assistance
                </div>
              </div>
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl dark:shadow-gray-700/50">
              <img
                src={aboutImage}
                alt="Developers collaborating"
                className="w-full h-110 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
