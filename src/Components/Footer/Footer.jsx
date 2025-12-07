import { Code2, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "Product",
    links: [
      { name: "Features", id: "features" },
      { name: "Pricing", href: "#" },
      { name: "API", href: "#" },
      { name: "Documentation", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Licenses", href: "#" },
    ],
  },
  {
    title: "Contact",
    links: [
      { name: "Support", href: "#" },
      { name: "Sales", href: "#" },
      { name: "Partnerships", href: "#" },
      { name: "Careers", href: "#" },
    ],
  },
];

export default function Footer() {

  return (
    <footer className="bg-[#1E293B] dark:bg-gray-900 text-white py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* About DevHub */}
          <div className="lg:col-span-2">
            <p className="text-white/70 dark:text-gray-100 mb-6 text-lx leading-relaxed">
              Connecting developers worldwide. Chat, Ask, Share, and Grow
              together. Welcome all skill levels! developers, coders, tech
              enthusiasts, and learners.
            </p>

            <p className="text-white/70 dark:text-gray-400 mb-6 text-sm leading-relaxed">
              The AI-powered knowledge community for developers. Write, learn,
              and connect with developers worldwide.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin, Mail].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-white/10 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-text-dark dark:hover:bg-text-dark transition-colors duration-200 text-gray-300 dark:text-gray-400 hover:text-white"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {sections.map((column) => (
            <div key={column.title}>
              <h3 className="mb-5 text-lg font-bold text-white dark:text-white">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link, index) => (
                  <li key={index}>
                    <Link to={link.href || "#"}>
                      <button
                        className="text-white/70 dark:text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {link.name}
                      </button>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 dark:text-gray-500 text-sm">
              © 2025 DevHub. All rights reserved.
            </p>

            <div className="flex gap-6">
              {["Sitemap", "Accessibility", "Status"].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-white/60 dark:text-gray-500 hover:text-white transition-colors duration-200 text-sm"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
