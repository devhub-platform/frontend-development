// FloatingMessages.jsx
import { useState, useRef } from "react";
import { MessageCircle, X, ArrowLeft, Send, Smile, Paperclip } from "lucide-react";

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
          {/* Large screens: Bottom bar */}
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setSelectedChat(null);
            }}
            className="sticky top-[93vh] left-0 z-50 rounded-tl-xl bg-primary w-full h-12 shadow-xl flex items-center justify-center absolute hover:bg-text-light transition-colors lg:block hidden"
          >
            <div className="flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
              <span className="ml-2 text-white font-semibold hidden lg:inline">
                Messages
              </span>
            </div>
            {unreadTotal > 0 && (
              <span className="absolute -top-1 -right-1 bg-bg-primary-dark text-white text-xs w-5 h-5 rounded-full flex items-center justify-center dark:bg-gray-400">
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
            className="fixed bottom-4 right-4 z-50 bg-primary w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:bg-text-light transition-colors lg:hidden"
          >
            <MessageCircle className="w-6 h-6 text-white" />
            {unreadTotal > 0 && (
              <span className="absolute -top-1 -right-1 bg-bg-primary-dark text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {unreadTotal}
              </span>
            )}
          </button>
        </>
      )}

      {/* Popup – Large screens bottom sheet */}
      {open && (
        <>
          {/* Large screens: Bottom sheet */}
          <div className="fixed inset-0 z-40 lg:flex hidden items-start justify-start rounded-tl-xl">
            <div className="mx-2 relative top-0">
              <div
                className="origin-bottom-left"
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
          <div className="fixed inset-0 z-40 lg:hidden">
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
        ${isLargeScreen ? 'w-90 h-130 rounded-t-2xl shadow-2xl mx-2 mt-[24.5vh]' : 'w-full h-full'}
        bg-white dark:bg-bg-secondary-dark overflow-hidden flex flex-col
        ${isLargeScreen ? 'origin-bottom-left animate-fadeInScale' : ''}
      `}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-primary">
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
          <span className="text-white font-semibold">Messages</span>
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
        <div className={`flex-1 ${isLargeScreen ? 'bg-white dark:bg-bg-secondary-dark' : ''}`}>
          <div className={`px-4 pt-4 space-y-3 ${isLargeScreen ? '' : 'p-4'}`}>
            {chatsMock.map((chat) => (
              <div key={chat.id}>
                <button
                  type="button"
                  onClick={() => setSelectedChat(chat.id)}
                  className={`
                    w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-blue-50 transition-colors 
                    dark:hover:bg-bg-primary-dark
                    ${isLargeScreen ? '' : 'p-3'}
                  `}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden" />
                    {chat.unread > 0 && (
                      <span className="absolute -top-1 -right-1 bg-text-light text-white text-xs w-5 h-5 rounded-full flex items-center justify-center dark:bg-text-dark">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold ${isLargeScreen ? 'text-bg-primary-dark dark:text-white' : 'dark:text-white'} truncate`}>
                        {chat.name}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {chat.time}
                      </span>
                    </div>
                    <p className={`text-xs ${isLargeScreen ? 'text-gray-600 dark:text-gray-300' : 'text-gray-600 dark:text-gray-300'} truncate`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                </button>
                {isLargeScreen && <div className="border-b border-gray-300 dark:border-bg-primary-dark my-2" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conversation */}
      {selectedChat != null && activeChat && (
        <div className={`flex-1 flex flex-col ${isLargeScreen ? 'bg-white dark:bg-gray-900/95' : ''}`}>
          {/* Chat header - only large screens */}
          {isLargeScreen && (
            <div className="border-b border-gray-200 px-4 py-3 flex items-center gap-3 dark:border-bg-primary-dark">
              <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden" />
              <span className="text-sm font-semibold text-bg-primary-dark dark:text-gray-100">
                {activeChat.name}
              </span>
            </div>
          )}

          <div className={`flex-1 px-4 py-4 space-y-3 overflow-y-auto ${isLargeScreen ? 'bg-[#F7FBFC] dark:bg-bg-secondary-dark' : 'bg-[#F7FBFC] dark:bg-bg-secondary-dark'}`}>
            {messagesMock.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    max-w-[80%] rounded-[15px] px-4 py-2 text-sm
                    ${
                      msg.sender === "me"
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                    }
                  `}
                >
                  <p>{msg.text}</p>
                  <p className="text-[10px] mt-1 opacity-80 text-right">
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Field */}
          <div className={`border-t px-3 py-3 ${isLargeScreen ? 'bg-white dark:bg-bg-secondary-dark' : ''} ${isLargeScreen ? 'border-gray-300 dark:border-gray-600' : 'border-gray-300'}`}>
            <div className="flex items-center gap-3 rounded-full px-3 py-1">
              <div className="flex flex-1 items-center rounded-full px-2 py-1 border-2 border-transparent focus-within:border-gray-300 transition-colors dark:focus-within:border-gray-500">
                {/* Hidden file input */}
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 items-center rounded-full min-h-10 max-h-32 px-5 min-w-0 outline-0 text-sm text-bg-primary-dark dark:text-gray-100"
                />

                <button
                  type="button"
                  onClick={handleAttachClick}
                  className="rounded-xl shrink-0 ml-3 cursor-pointer hover:bg-gray-100 p-1 dark:hover:bg-gray-700 transition-colors"
                >
                  <Paperclip size={23} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleSend}
                className="rounded-full hover:shadow-lg hover:shadow-primary/50 transition-all shrink-0 bg-text-light text-white w-10 h-10 relative dark:bg-text-dark dark:focus:ring-blue-900"
              >
                <Send size={23} className="absolute left-2 top-2.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
