import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Loader2,
  ScrollText,
  Pencil,
  Trash,
  X,
} from "lucide-react";
import axiosInstance from "../../config/api";

const ReadingListDetails = () => {
  const { id } = useParams(); // بناخد الـ id من اللينك
  const navigate = useNavigate();
  const [listData, setListData] = useState(null);
  const [loading, setLoading] = useState(true);

  //   Editing on list
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [tempNote, setTempNote] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const { data } = await axiosInstance.get(`/reading-lists/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListData(data.data);
        setEditTitle(data.data.title);
        setEditDescription(data.data.description || "");
      } catch (error) {
        console.error("Error fetching list details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListDetails();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("userToken");
      await axiosInstance.patch(
        `/reading-lists/${id}`,
        { title: editTitle, description: editDescription },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setListData((prev) => ({
        ...prev,
        title: editTitle,
        description: editDescription,
      }));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update list" + error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      try {
        const token = localStorage.getItem("userToken");
        await axiosInstance.delete(`/reading-lists/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate(-1); // بعد الحذف نرجع لصفحة البروفايل
      } catch (error) {
        console.error("Failed to delete list" + error);
      }
    }
  };

  const handleRemovePost = async (postId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this post from your list?",
      )
    ) {
      setProcessingId(postId); // هنستخدم نفس الـ state للتحميل
      try {
        const token = localStorage.getItem("userToken");
        await axiosInstance.delete(
          `/reading-lists/${id}/remove-post/${postId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // تحديث الـ UI: هنشيل البوست خالص من المصفوفة
        setListData((prev) => ({
          ...prev,
          posts: prev.posts.filter((p) => p.id !== postId),
        }));
      } catch (error) {
        console.error("Error removing post:", error);
      } finally {
        setProcessingId(null);
      }
    }
  };

  const handleSaveNote = async (postId) => {
    if (!tempNote.trim()) return;
    setProcessingId(postId);
    try {
      const token = localStorage.getItem("userToken");
      await axiosInstance.post(
        `/reading-lists/${id}/add-note/${postId}`,
        { note: tempNote },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setListData((prev) => ({
        ...prev,
        posts: prev.posts.map((p) =>
          p.id === postId ? { ...p, note: tempNote } : p,
        ),
      }));
      setEditingNoteId(null);
    } catch (error) {
      console.error("Failed to save note" + error);
    } finally {
      setProcessingId(null); // وقف التحميل
    }
  };

  const handleDeleteNote = async (postId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
        setProcessingId(postId);
    try {
      const token = localStorage.getItem("userToken");
      // هنا استخدمنا delete بناءً على طلبك
      await axiosInstance.delete(`/reading-lists/${id}/delete-note/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // تحديث الـ UI ومسح النوت من الـ state
      setListData(prev => ({
        ...prev,
        posts: prev.posts.map(p => p.id === postId ? { ...p, note: null } : p)
      }));
      setTempNote(""); // تصفير الـ tempNote
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
        setProcessingId(null);
    }
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center dark:text-white flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!listData) return <div className="text-center py-20">List not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-50 dark:bg-bg-secondary-dark">
      {/* Edit & Delete Buttons */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">Edit List</h2>
              <button onClick={() => setIsEditModalOpen(false)}>
                <X className="text-gray-400 hover:text-text-light dark:hover:text-text-dark" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-lg font-medium text-[#1b4965] dark:text-gray-200">
                  Title
                </label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2 mt-1.5 rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-[#62b6cb]"
                  required
                />
              </div>
              <div>
                <label className="text-lg font-medium text-[#1b4965] dark:text-gray-200">
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full h-25 px-4 py-2 mt-1.5 rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-[#62b6cb]"
                />
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  disabled={isUpdating}
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 flex justify-center"
                >
                  {isUpdating ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-3 rounded-xl transition-colors"
                >
                  <Trash size={18} /> Delete List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Back Button & Header */}
      <Link
        to={-1}
        className="flex items-center text-gray-500 hover:text-text-light hover:dark:text-text-dark mb-6 transition-colors w-fit"
      >
        <ChevronLeft size={20} />
        <span>Back to Lists</span>
      </Link>

      <div className="mb-10">
        <div className="flex justify-between align-items-center">
          <h1 className="text-4xl font-bold dark:text-white mb-2">
            {listData.title}
          </h1>
          <Pencil
            size={22}
            strokeWidth={2.4}
            onClick={() => setIsEditModalOpen(true)}
            className="text-gray-600 dark:text-gray-200 cursor-pointer hover:text-text-light hover:dark:text-text-dark"
          />
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          {listData.description}
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
          <ScrollText size={18} />
          <span>{listData.posts?.length || 0} Posts</span>
        </div>
      </div>

      {/* Posts Grid/List */}
      <div className="grid gap-6 my-3">
        {listData.posts?.length > 0 ? (
          listData.posts.map((post) => (
            <div key={post.id} className="w-full cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
              <div className="flex w-full items-center group">
                <div className="border-l-3 h-10 ml-5 mb-2 border-text-light dark:border-text-dark"></div>
                <div className="w-full flex h-10 mb-2">
                  <form
                    action=""
                    className="w-full onSubmit={(e) => { e.preventDefault(); handleSaveNote(post.id); }}"
                  >
                    <input
                      type="text"
                      disabled={editingNoteId !== post.id}
                      value={
                        editingNoteId === post.id ? tempNote : post.note || ""
                      }
                      onChange={(e) => setTempNote(e.target.value)}
                      placeholder="Add a note..."
                      className={`w-full bg-white dark:bg-gray-800/40 italic text-lg outline-none h-10 pl-2 ml-3
              ${editingNoteId === post.id ? "text-primary cursor-text" : "text-gray-700 dark:text-gray-100 cursor-default"}`}
                      autoFocus
                    />
                  </form>

                  {/* أيقونات التحكم - بتظهر بوضوح أكتر لما اليوزر يعمل Hover على المنطقة */}
                  <div className="flex items-center gap-3 ml-2 px-2">
                    {/* لو البوست ده هو اللي بيحمل حالياً، اظهر Spinner فقط */}
                    {processingId === post.id ? (
                      <Loader2
                        className="animate-spin text-primary"
                        size={20}
                      />
                    ) : editingNoteId === post.id ? (
                      // وضع التعديل (Save / Cancel)
                      <>
                        <button
                          onClick={() => handleSaveNote(post.id)}
                          className="text-text-light dark:text-text-dark hover:scale-110 font-bold text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingNoteId(null);
                            setTempNote("");
                          }}
                          className="text-gray-400"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      // الوضع العادي (Pencil / Trash)
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingNoteId(post.id);
                            setTempNote(post.note || "");
                          }}
                          className="text-gray-400 hover:text-blue-500"
                        >
                          <Pencil size={18} />
                        </button>
                        {post.note && (
                          <button
                            onClick={() => handleDeleteNote(post.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash size={18} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div
                key={post.id}
                className="relative flex gap-4 bg-white dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800/40 dark:hover:shadow-xl hover:shadow-md transition-shadow"
              >
                <button
    onClick={() => handleRemovePost(post.id)}
    disabled={processingId === post.id}
    className="absolute top-3 right-3 p-2 dark:bg-red-900/20 text-gray-500 rounded-lg opacity-100 group-hover/card:opacity-100 transition-opacity hover:text-red-500 disabled:opacity-50 cursor-pointer"
    title="Remove from list"
  >
    {processingId === post.id ? (
      <Loader2 size={16} className="animate-spin" />
    ) : (
      <Trash size={16} />
    )}
  </button>
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-38 h-28 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold dark:text-white line-clamp-2 mb-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {post.excerpt || post.content?.substring(0, 100) + "..."}
                  </p>
                  {/* <div className="flex gap-2 flex-wrap">
                    {post.tags.map((tag, i) => (
                        <span
                        key={i}
                        className="bg-gray-100 text-xs px-2 py-1 rounded-full dark:bg-gray-800 dark:text-gray-100"
                        >
                        {tag}
                        </span>
                    ))}
                    </div> */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-2xl">
            No posts in this list yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingListDetails;
