import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Helmet from "react-helmet";
import { UserCheck, UserPlus, Sparkles } from "lucide-react";

const developers = [
  {
    id: 1,
    name: "Ahmed Ali",
    role: "Senior Front-end",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  },
  {
    id: 2,
    name: "Sara Mohamed",
    role: "Full Stack Expert",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  },
  {
    id: 3,
    name: "Omar Hassan",
    role: "Backend Architect",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
  },
  {
    id: 4,
    name: "Mona Samir",
    role: "UI/UX Designer",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
  },
  {
    id: 5,
    name: "Ziad Nour",
    role: "DevOps Engineer",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
  },
  {
    id: 6,
    name: "Laila Reda",
    role: "Mobile App Developer",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
  },
  {
    id: 7,
    name: "Karim Walid",
    role: "AI Research Engineer",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop",
  },
  {
    id: 8,
    name: "Nouran Ali",
    role: "Cyber Security",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop",
  },
];

export default function Recommendations() {
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();

  const toggleFollow = (id) => {
    setFollowing((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id],
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] relative flex flex-col items-center py-8 md:py-16  px-2 overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-150 h-150 bg-primary/10 rounded-full blur-[120px] -z-10" />

      <Helmet>
        <title>DevHub | Connect</title>
      </Helmet>

      <div className="max-w-5xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
            Connect with{" "}
            <span className="text-primary dark:text-text-dark italic">
              Pros
            </span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-medium max-w-md mx-auto">
            Build your network by following top industry experts.
          </p>
        </div>

        {/* Cards Grid - 8 items now */}
        <div className="grid md:grid-cols-2 gap-6">
          {developers.map((dev) => (
            <div
              key={dev.id}
              className="group flex items-center justify-between p-5 bg-white dark:bg-slate-900/40 backdrop-blur-sm rounded-xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-primary/40 dark:hover:border-primary transition-all duration-500 shadow-2xl shadow-slate-200 dark:shadow-slate-800/50 hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <img
                  src={dev.img}
                  alt={dev.name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-3xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 shadow-md"
                />
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base md:text-lg">
                    {dev.name}
                  </h4>
                  <p className="text-primary dark:text-text-dark text-[10px] md:text-xs font-black uppercase tracking-widest">
                    {dev.role}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleFollow(dev.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black transition-all ${
                  following.includes(dev.id)
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                    : "bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50"
                }`}
              >
                {following.includes(dev.id) ? (
                  <>
                    <UserCheck size={16} strokeWidth={3} /> FOLLOWING
                  </>
                ) : (
                  <>
                    <UserPlus size={16} strokeWidth={3} /> FOLLOW
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-8">
          <button
            onClick={() => navigate("/home")}
            className="group relative w-full max-w-sm h-16 bg-primary/95 dark:bg-primary/95 text-white font-black text-xl rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-2xl overflow-hidden cursor-pointer"
          >
            <span className="relative z-10 tracking-[0.2em]">LET'S START</span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
