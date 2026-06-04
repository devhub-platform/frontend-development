import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown"; 
import { PostHeader } from "../../Components/PostDetailsComponents/PostHeader";
import { ChatPanel } from "../../Components/PostDetailsComponents/ChatPanel";
import { ChatButton } from "../../Components/PostDetailsComponents/ChatButton";
import { Messages } from "../../Components/Messages/Messages";
import { InteractionBar } from "../../Components/PostDetailsComponents/InteractionBar";
import { CommentSection } from "../../Components/PostDetailsComponents/CommentSection";
import axiosInstance from "../../config/api";

export default function PostDetails() {
  const { id } = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("userToken");
        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        };

        // جلب البوست والكومنتات في نفس الوقت
        const [postRes, commentsRes] = await Promise.all([
          axiosInstance.get(`/posts/${id}`, { headers }),
          axiosInstance.get(`/posts/${id}/comments`, { headers }),
        ]);

        const p = postRes.data.data;
        setPostData({
          id: p.id,
          title: p.title,
          content: p.content,
          image: p.cover_image || p.image_url?.[0] || null,
          author: p.user?.name || "Unknown",
          authorAvatar: p.user?.avatar_image || null,
          authorUsername: p.user?.username || "",
          date: p.created_at || "",
          readingTime: p.read_time || "",
          tags: p.tags?.map((t) => t.name) || [],
          reactionsCount: Object.values(
            p.reaction?.reaction_with_count || {},
          ).reduce((a, b) => a + b, 0),
          commentsCount: p.reaction?.comments_count || 0,
          views: p.views || 0,
          userId: p.user?.id || null,
      });

        
        // استخراج الكومنتات الخام من الـ API
        const rawComments = commentsRes.data.data?.comments || commentsRes.data.comments || [];
        
        // 1. عزل الكومنتات الأساسية (التي ليست رداً على كومنت آخر)
        const mainComments = rawComments.filter(c => !c.is_reply || c.parent_id === null);
        
        // 2. عزل الـ Replies فقط
        const allReplies = rawComments.filter(c => c.is_reply && c.parent_id !== null);

        // 3. بناء الهيكل الشجري: ربط الـ Replies بالـ Comments الأساسية بتاعتها
        const mappedComments = mainComments.map((c) => ({
          id: c.id,
          author: {
            name: c.user?.name || "User",
            avatar: c.user?.avatar_url || c.user?.avatar_image || `https://ui-avatars.com/api/?name=${c.user?.name || "User"}&background=random`,
          },
          text: c.content || c.body || "",
          time: c.created_at || "",
          likes: c.likes || 0,
          replies: allReplies
            .filter((r) => r.parent_id === c.id) // فلترة الردود اللي تخص الكومنت ده بس
            .map((r) => ({
              id: r.id,
              author: {
                name: r.user?.name || "User",
                avatar: r.user?.avatar_url || r.user?.avatar_image || `https://ui-avatars.com/api/?name=${r.user?.name || "User"}&background=random`,
              },
              text: r.content || r.body || "",
              time: r.created_at || "",
              likes: r.likes || 0,
            })),
        }));

        setComments(mappedComments);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-bg-primary-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="text-center mt-20 dark:text-white">Post not found!</div>
    );
  }

  return (
    <>
      <div className="flex justify-center dark:bg-bg-primary-dark">
        <div className="lg:min-w-[70%] min-h-screen bg-white lg:mx-2 dark:bg-bg-primary-dark">
          <div className="flex items-start justify-center dark:bg-bg-secondary-dark my-5 rounded-2xl">
            <div className="min-w-[85%] max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-8 mx-2">
              {/* Cover Image */}
              {postData.image && (
                <div className="mb-6">
                  <img
                    src={postData.image}
                    alt="Post cover"
                    className="w-full h-100 object-cover rounded-2xl shadow-sm"
                  />
                </div>
              )}

              {/* Post Header */}
              <PostHeader
                author={postData.author}
                authorAvatar={postData.authorAvatar}
                date={postData.date}
                readingTime={postData.readingTime}
                userId={postData.userId}
              />

              {/* Tags */}
              {postData.tags.length > 0 && (
                <div className="py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {postData.tags.map((tag, index) => (
                      <button
                        key={index}
                        className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors whitespace-nowrap dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Post Content */}
              <article className="py-8">
                <h1 className="text-4xl font-bold text-bg-secondary-dark mb-6 dark:text-white">
                  {postData.title}
                </h1>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div className="text-gray-700 dark:text-gray-200 space-y-5">
                    <ReactMarkdown>{postData.content}</ReactMarkdown>
                  </div>
                </div>
              </article>

              {/* Interaction Bar */}
              <InteractionBar
                postId={postData.id}
                commentsCount={postData.commentsCount}
                reactionsCount={postData.reactionsCount}
                views={postData.views}
                content={postData.content}
              />

              {/* Comments Section */}
              <CommentSection postId={postData.id} initialComments={comments} commentsCount={postData.commentsCount} />
            </div>

            {/* Chat Panel */}
            <ChatPanel
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              postId={postData.id}
            />
          </div>

          <div>
            <ChatButton
              onClick={() => setIsChatOpen(true)}
              isVisible={!isChatOpen}
            />
          </div>
        </div>
      </div>
    </>
  );
}