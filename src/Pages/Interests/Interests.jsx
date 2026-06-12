import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Helmet from "react-helmet";
import { LoaderPinwheel } from "lucide-react";
import {
  getAllPlatformTopics,
  getMyFollowedTopics,
  addUserTopics,
} from "../../services/LandingApi";
import toast from "react-hot-toast";

export default function Interests() {
  const [apiTopics, setApiTopics] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // 🔴 ربط كامل ومباشر بدوال الـ LandingApi لجلب الداتا الحية وتعمل Sync لليوزر
  useEffect(() => {
    const loadTopicsData = async () => {
      try {
        setLoading(true);

        // 1. جلب كل الـ Topics المتاحة على المنصة
        const allRes = await getAllPlatformTopics();
        const allTopics = allRes?.data || [];
        setApiTopics(allTopics);

        // 2. جلب اهتمامات اليوزر الحالية المسجلة على أكونته لتفعيلها تلقائياً
        const myRes = await getMyFollowedTopics();
        const myTopics = myRes?.data || [];

        const myIds = myTopics.map((t) => t.id);
        setSelectedIds(myIds);
      } catch (err) {
        console.error("Error loading topics workflow:", err);
        toast.error("Failed to load platform topics.");
      } finally {
        setLoading(false);
      }
    };
    loadTopicsData();
  }, []);

  const toggleTopic = (topicId) => {
    setSelectedIds((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId],
    );
  };

  // 🔴 ربط حفظ الاهتمامات بدالة addUserTopics الرسمية
  const handleSaveInterests = async () => {
    if (selectedIds.length < 3) {
      toast.error(
        "Please select at least 3 interests to personalize your feed.",
      );
      return;
    }

    try {
      setSubmitting(true);
      const res = await addUserTopics(selectedIds);

      toast.success(res?.message || "Interests synchronized successfully! 🎉");
      navigate("/recommendations");
    } catch (err) {
      console.error("Error saving interests:", err);
      toast.error(
        err.response?.data?.message || "Failed to save your interests.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] flex flex-col items-center p-4 font-sans transition-colors duration-500">
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
          <p className="text-slate-500 dark:text-slate-400 text-base font-bold">
            Select at least 3 to personalize your feed ({selectedIds.length}/3)
          </p>
        </div>

        {/* الـ Topics الديناميكية الراجعة من السيرفر كلياً مع الحفاظ على الـ Skeleton Loader */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl"
                />
              ))
            : apiTopics.map((topic) => {
                const isSelected = selectedIds.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={`px-6 py-3.5 rounded-2xl border font-extrabold transition-all duration-300 transform active:scale-95 cursor-pointer text-sm ${
                      isSelected
                        ? "bg-primary border-primary text-white shadow-xl shadow-primary/30"
                        : "bg-transparent border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary dark:hover:border-text-dark"
                    }`}
                  >
                    {topic.name}
                  </button>
                );
              })}
        </div>

        {/* Bottom Actions Bar */}
        <div className="mt-auto flex flex-col items-center gap-5 pb-10">
          <button
            onClick={handleSaveInterests}
            disabled={selectedIds.length < 3 || submitting || loading}
            className="w-full max-w-sm h-16 bg-primary text-white font-black text-xl rounded-2xl transition-all shadow-2xl shadow-primary/20 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
          >
            {submitting ? (
              <LoaderPinwheel className="animate-spin w-6 h-6" />
            ) : (
              "CONTINUE"
            )}
          </button>
          <button
            onClick={() => navigate("/home")}
            className="text-slate-400 dark:text-slate-500 font-bold hover:text-primary transition-colors text-sm tracking-[0.2em] uppercase cursor-pointer"
          >
            SKIP FOR NOW
          </button>
        </div>
      </div>
    </div>
  );
}
