import React from "react";
import { MessageCircle, Heart, AtSign, Trash2, Clock } from "lucide-react";

export function NotificationCard({ notification, onMarkAsRead, onDelete }) {
  const getIconConfig = () => {
    const simpleType =
      notification.type === "App\\Notifications\\NewCommentNotification"
        ? "comment"
        : notification.type === "App\\Notifications\\ReactNotification"
          ? "reaction"
          : notification.type;

    switch (simpleType) {
      case "comment":
        return {
          icon: <MessageCircle size={14} />,
          color: "bg-primary", // استخدام لون موقعك الأساسي
        };
      case "mention":
        return {
          icon: <AtSign size={14} />,
          color: "bg-purple-500",
        };
      case "reaction":
        return {
          icon: <Heart size={14} />,
          color: "bg-pink-500",
        };
      default:
        return { icon: null, color: "bg-slate-500" };
    }
  };

  const config = getIconConfig();

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (Number.isNaN(diff)) return "";
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
      className={`group relative mx-2 my-3 rounded-2xl transition-all duration-300 cursor-pointer border
        ${
          !notification.isRead
            ? "bg-white dark:bg-bg-secondary-dark/50 shadow-xl shadow-primary/5 border-primary/20 dark:border-primary/30"
            : "bg-white/40 dark:bg-transparent border-transparent hover:border-slate-200 dark:hover:border-neutral-700"
        }`}
    >
      <div className="p-4 flex gap-4 items-start">
        {/* Avatar Section */}
        <div className="relative shrink-0">
          <div
            className={`p-0.5 rounded-full ring-2 ${!notification.isRead ? "ring-primary/40" : "ring-transparent"}`}
          >
            <img
              src={notification.avatar}
              alt={notification.username}
              className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-bg-secondary-dark shadow-sm"
            />
          </div>
          <div
            className={`absolute -bottom-1 -right-1 p-1.5 rounded-full text-white shadow-lg ${config.color} border-2 border-white dark:border-bg-secondary-dark`}
          >
            {config.icon}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-slate-900 dark:text-white truncate">
              {notification.username}
            </h4>
            <span className="text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-wider bg-primary/10 text-primary dark:bg-primary/20 dark:text-text-dark">
              {notification.badgeLabel}
            </span>
          </div>

          <p className="text-sm text-slate-600 dark:text-neutral-300 leading-snug">
            {notification.action}
          </p>

          {notification.content && (
            <div className="relative pl-3 border-l-2 border-primary/30 dark:border-primary/20 my-2 bg-slate-50/50 dark:bg-white/5 p-2 rounded-r-lg">
              <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 italic">
                “{notification.content}”
              </p>
            </div>
          )}

          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-tight">
            <Clock size={12} className="text-primary/60" />
            {formatTimestamp(notification.timestamp)}
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className="absolute right-2 top-2 p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
        >
          <Trash2 size={16} />
        </button>

        {/* Unread Glow Dot */}
        {!notification.isRead && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_12px_#003890]" />
          </div>
        )}
      </div>
    </div>
  );
}
