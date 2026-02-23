/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Helmet from "react-helmet";
import { LoaderPinwheel } from "lucide-react";

const topics = [
  "Front-end",
  "Back-end",
  "Flutter",
  "Dart",
  "Mobile",
  "Web Dev",
  "Data Science",
  "AI/ML",
  "DevOps",
  "JavaScript",
  "Node",
  "REST API",
  "MongoDB",
  "Docker",
  "Kotlin",
  "Python",
  "TypeScript",
  "React",
  "Angular",
  "Vue",
  "C#",
  "Go",
  "Swift",
  "Ruby",
  "PHP",
  "SQL",
];

export default function Interests() {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const toggleTopic = (topic) => {
    setSelected((prev) =>
      prev.includes(topic) ? prev.filter((i) => i !== topic) : [...prev, topic],
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] flex flex-col items-center p-2 font-sans transition-colors duration-500">
      <Helmet>
        <title>DevHub | Interests</title>
      </Helmet>

      <div className="w-full max-w-5xl flex flex-col">
        {/* Header Section */}
        <div className="text-center mt-10 mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3">
            Pick your{" "}
            <span className="text-primary dark:text-text-dark">interests</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
            Select at least 3 to personalize your feed ({selected.length}/3)
          </p>
        </div>

        {/* Topics Grid - تظهر بشكل ممتاز في كل الشاشات */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={`px-6 py-3.5 rounded-2xl border font-bold transition-all duration-300 transform active:scale-95 ${
                selected.includes(topic)
                  ? "bg-primary border-primary text-white shadow-xl shadow-primary/30"
                  : "bg-transparent border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary  dark:hover:border-text-dark"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Sticky-like Bottom Actions */}
        <div className="mt-auto flex flex-col items-center gap-5 pb-10">
          <button
            onClick={() => navigate("/recommendations")}
            disabled={selected.length < 3}
            className="w-full max-w-sm h-16 bg-primary text-white font-black text-xl rounded-2xl transition-all shadow-2xl shadow-primary/20 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <LoaderPinwheel className="animate-spin w-6 h-6" />
            ) : (
              "CONTINUE"
            )}
          </button>
          <button
            onClick={() => navigate("/home")}
            className="text-slate-400 dark:text-slate-500 font-bold hover:text-primary transition-colors text-sm tracking-[0.2em] uppercase"
          >
            SKIP FOR NOW
          </button>
        </div>
      </div>
    </div>
  );
}
