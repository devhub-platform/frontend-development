// FloatingMessages.jsx
import { useState, useRef } from "react";
import { MessageCircle, X, ArrowLeft, Send, Paperclip } from "lucide-react";

const chatsMock = [
  { id: 0, name: "Sarah Johnson", lastMessage: "Thanks for the feedback on my article...", time: "2m ago", unread: 2 },
  { id: 1, name: "Michael Chen", lastMessage: "Would love to collaborate on a pr...", time: "1h ago", unread: 0 },
  { id: 2, name: "Emily Rodriguez", lastMessage: "Great insights on UX design!", time: "3h ago", unread: 0 },
];

const messagesMock = [
  { id: 1, sender: "them", text: "Hi! I really enjoyed your recent article on AI.", time: "10:30 AM" },
  { id: 2, sender: "me", text: "Thank you! I appreciate your feedback.", time: "10:32 AM" },
  { id: 3, sender: "them", text: "Thanks for the feedback on my article!", time: "10:35 AM" },
];

export function Messages() {
  const [open, setOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  const unreadTotal = chatsMock.reduce((acc, c) => acc + c.unread, 0);

  return (
    <>
      {/* Floating button - Bottom bar for large screens */}
      {!open && (
        <>
          {/* Large screens: Bottom Right Bar */}
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setSelectedChat(null);
            }}
            className="fixed bottom-0 right-8 z-50 rounded-t-xl bg-primary w-64 h-12 shadow-xl flex items-center justify-center hover:bg-opacity-90 transition-colors lg:flex hidden"
          >
            <div className="flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
              <span className="ml-2 text-white font-semibold">
                Messages
              </span>
            </div>
            {unreadTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {unreadTotal}
              </span>
            )}
          </button>

          {/* Small/Medium screens: Floating circle button */}
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setSelectedChat(null);
            }}
            className="fixed bottom-4 right-4 z-50 bg-primary w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:bg-opacity-90 transition-colors lg:hidden"
          >
            <MessageCircle className="w-6 h-6 text-white" />
            {unreadTotal > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {unreadTotal}
              </span>
            )}
          </button>
        </>
      )}

      {/* Popup – Large screens bottom sheet */}
      {open && (
        <>
          {/* Large screens: Positioned Right */}
          <div className="fixed inset-0 z-50 lg:flex hidden items-end justify-end pointer-events-none">
            <div className="mr-8 relative pointer-events-auto">
              <div
                className="origin-bottom-right"
                style={{ animation: "fadeInScale 0.25s ease-out" }}
              >
                <MessagesPopup
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  onClose={() => setOpen(false)}
                  isLargeScreen={true}
                />
              </div>
            </div>
          </div>

          {/* Small/Medium screens: Fullscreen */}
          <div className="fixed inset-0 z-50 lg:hidden">
            <MessagesPopup
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              onClose={() => setOpen(false)}
              isLargeScreen={false}
            />
          </div>
        </>
      )}
    </>
  );
}

function MessagesPopup({ selectedChat, setSelectedChat, onClose, isLargeScreen }) {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const activeChat =
    selectedChat != null
      ? chatsMock.find((c) => c.id === selectedChat) || null
      : null;

  const handleSend = () => {
    if (!message.trim()) return;
    setMessage("");
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    console.log("selected files:", files);
  };

  return (
    <div 
      className={`
        ${isLargeScreen ? 'w-96 h-[500px] rounded-t-2xl shadow-2xl border border-gray-200 dark:border-gray-700' : 'w-full h-full'}
        bg-white dark:bg-gray-900 overflow-hidden flex flex-col
        ${isLargeScreen ? 'origin-bottom-right' : ''}
      `}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-primary shrink-0">
        <div className="flex items-center gap-2">
          {selectedChat != null && (
            <button
              type="button"
              onClick={() => setSelectedChat(null)}
              className="text-white hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <span className="text-white font-semibold">
            {selectedChat != null && activeChat ? activeChat.name : "Messages"}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-white hover:opacity-80 transition-opacity"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat list */}
      {selectedChat == null && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {chatsMock.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => setSelectedChat(chat.id)}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden" />
                  {chat.unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {chat.name}
                    </p>
                    <span className="text-[10px] text-gray-500">
                      {chat.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversation */}
      {selectedChat != null && activeChat && (
        <div className="flex-1 flex flex-col min-h-0 bg-gray-50 dark:bg-gray-950">
          <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
            {messagesMock.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm
                    ${msg.sender === "me"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none border border-gray-100 dark:border-gray-700"
                    }
                  `}
                >
                  <p>{msg.text}</p>
                  <p className="text-[10px] mt-1 opacity-70 text-right">
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Field */}
          <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center gap-3">
            <div className="flex flex-1 items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-1">
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleAttachClick}
                className="text-gray-500 hover:text-primary transition-colors p-1"
              >
                <Paperclip size={20} />
              </button>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 text-gray-900 dark:text-white outline-none"
              />
            </div>
              <button
                type="button"
                onClick={handleSend}
                disabled={!message.trim()}
                className="bg-primary text-white p-1.5 rounded-full disabled:opacity-50 hover:scale-105 transition-transform"
              >
                <Send size={18} />
              </button>
          </div>
        </div>
      )}
    </div>
  );
}