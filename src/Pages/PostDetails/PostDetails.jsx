import { useState } from "react";
import { useParams } from "react-router-dom";
import { PostHeader } from "../../Components/PostDetailsComponents/PostHeader";
import { ChatPanel } from "../../Components/PostDetailsComponents/ChatPanel";
import { posts } from "../../context/PostsData";
import { ChatButton } from "../../Components/PostDetailsComponents/ChatButton";
import { Messages } from "../../Components/Messages/Messages";
import { InteractionBar } from "../../Components/PostDetailsComponents/InteractionBar";
import { CommentSection } from "../../Components/PostDetailsComponents/CommentSection";

const commentsData = [
  {
    id: 1,
    author: {
      name: "Michael Chen",
      avatar:
        "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },
    text: "Great insights! We've recently redesigned our office space following these principles, and the impact on team collaboration has been remarkable.",
    time: "2 hours ago",
    likes: 12,
  },
  {
    id: 2,
    author: {
      name: "Emily Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1628210726948-4979adb3d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },
    text: "The point about technology integration is spot on. Our company invested in smart booking systems last year and it completely transformed how we use our office space.",
    time: "5 hours ago",
    likes: 8,
  },
  {
    id: 3,
    author: {
      name: "David Kim",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    text: "I'd love to hear more about the sustainability aspects. How can companies balance flexibility with environmental responsibility?",
    time: "1 day ago",
    likes: 5,
  },
];

export default function App() {
  const { id } = useParams();
  const postId = parseInt(id, 10);
  const postData = posts.find((p) => p.id === postId);
  const paragraphs = postData.excerpt.split("\n\n");

  const [isChatOpen, setIsChatOpen] = useState(false);

    if (!postData) {
    return <div className="text-center mt-20">Post not found!</div>;
  }

  return <>
  <div className="flex dark:bg-bg-primary-dark">
    {/* زر عائم للموبايل / تابلت (أيقونة فقط) */}
            <div className="fixed bottom-4 right-4 z-50 lg:hidden">
              <Messages />
            </div>
    
            {/* Sidebar لسطح المكتب – الكود الأصلي كما هو */}
            <div className="w-[23%] mt-10 ml-3 hidden lg:block relative">
              <Messages />
            </div>

             <div className="min-h-screen bg-white lg:mx-2 dark:bg-bg-primary-dark">
      <div className="flex items-start justify-center dark:bg-bg-secondary-dark my-5 rounded-2xl">
        <div className="max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Cover Image */}
          <div className="mb-6">
            <img
              src={postData.image}
              alt="Post cover"
              className="w-full h-[400px] object-cover rounded-2xl shadow-sm"
            />
          </div>

          {/* Post Header */}
          <PostHeader
            author={postData.author}
            date={postData.date}
            readingTime={postData.readingTime}
          />

          {/* Tags */}
          <div className="py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {postData.tags.map((tag, index) => (
                    <button
                      key={index}
                      className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors whitespace-nowrap
                                  dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

          {/* Post Content */}
          <article className="py-8">
            <h1 className="text-4xl font-bold text-bg-secondary-dark mb-6 dark:text-white">
              {postData.title}
            </h1>
            <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 dark:text-gray-200 space-y-5">
                  {paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
            </div>
          </article>

          {/* Interaction Bar */}
          <InteractionBar commentsCount={postData.commentsCount} reactionsCount={postData.reactionsCount} views={postData.views} />

          {/* Comments Section */}
          <CommentSection initialComments={commentsData} />
        </div>

        {/* Chat Panel */}
        <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>

      {/* Floating Action Button */}
      <ChatButton
        onClick={() => setIsChatOpen(true)}
        isVisible={!isChatOpen}
      />
    </div>
  </div>
  </>
}
