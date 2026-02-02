import {
  Plus,
  MoreVertical,
  Share2,
  Pin,
  Edit3,
  Trash2,
  Search,
  Menu,
  MessageSquare,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";

export default function Sidebar({
  chats,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onShareChat,
  onPinChat,
  currentChatId,
  isMobile = false,
  onCloseMobile,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const filteredChats = useMemo(() => {
    return chats.filter((chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [chats, searchQuery]);

  const handleRenameStart = (chat) => {
    setRenamingId(chat.id);
    setRenameValue(chat.title);
    setMenuOpenId(null);
  };

  const sidebarWidth = isMobile
    ? "w-full max-w-xs"
    : isCollapsed
      ? "w-20"
      : "w-72";

  return (
    <div
      className={`bg-white dark:bg-bg-secondary-dark border-r border-gray-200 dark:border-gray-800 flex flex-col h-full md:h-[90vh] transition-all duration-500 ease-in-out ${sidebarWidth}`}
    >
      <div className="p-4 space-y-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          {!isCollapsed && (
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Chats
            </span>
          )}
        </div>

        {isMobile && (
          <button
            onClick={onCloseMobile}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="px-4">
        <button
          onClick={onNewChat}
          className={`w-full bg-primary hover:opacity-90 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-primary/20 ${
            isCollapsed ? "justify-center p-2.5" : "px-4 py-3"
          }`}
        >
          <Plus className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {!isCollapsed && (
        <div className="px-4 mt-4 mb-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-primary/50 rounded-xl text-sm outline-none transition-all"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar">
        {filteredChats.map((chat) => (
          <div key={chat.id} className="relative group rounded-xl">
            <button
              onClick={() => onSelectChat(chat)}
              className={`w-full flex items-center gap-3 text-left rounded-xl transition-all ${
                currentChatId === chat.id
                  ? "bg-gray-100 dark:bg-gray-800 shadow-sm"
                  : "hover:bg-gray-50 dark:hover:bg-gray-900"
              } ${isCollapsed ? "justify-center p-3" : "px-3 py-3"}`}
            >
              {!isCollapsed ? (
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <MessageSquare
                      size={16}
                      className={
                        currentChatId === chat.id
                          ? "text-primary"
                          : "text-gray-400"
                      }
                    />
                    {renamingId === chat.id ? (
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => {
                          onRenameChat(chat.id, renameValue);
                          setRenamingId(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            onRenameChat(chat.id, renameValue);
                            setRenamingId(null);
                          }
                        }}
                        className="w-full text-sm font-medium bg-white dark:bg-gray-700 px-2 py-1 rounded border border-primary outline-none"
                      />
                    ) : (
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                          {chat.title}
                        </span>
                        {chat.pinned && (
                          <Pin
                            size={12}
                            className="text-primary fill-current rotate-45"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {!renamingId && (
                    <div className="relative ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(
                            menuOpenId === chat.id ? null : chat.id,
                          );
                        }}
                        className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical size={16} className="text-gray-400" />
                      </button>

                      {menuOpenId === chat.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onShareChat(chat.id);
                              setMenuOpenId(null);
                            }}
                            className="w-full px-4 py-2 text-xs flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                          >
                            <Share2 size={14} /> Share
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRenameStart(chat);
                            }}
                            className="w-full px-4 py-2 text-xs flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                          >
                            <Edit3 size={14} /> Rename
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onPinChat(chat.id);
                              setMenuOpenId(null);
                            }}
                            className="w-full px-4 py-2 text-xs flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                          >
                            <Pin
                              size={14}
                              className={
                                chat.pinned ? "text-primary fill-current" : ""
                              }
                            />{" "}
                            {chat.pinned ? "Unpin" : "Pin"}
                          </button>
                          <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteChat(chat.id);
                              setMenuOpenId(null);
                            }}
                            className="w-full px-4 py-2 text-xs flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                currentChatId === chat.id && (
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                )
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
