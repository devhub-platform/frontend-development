import { useEffect, useMemo, useState } from "react";
import { Coffee } from "lucide-react";
import { NotificationFeed } from "../../Components/Notification/NotificationFeed";
import { NotificationCard } from "../../Components/Notification/NotificationCard";
import notificationsApi from "../../services/notificationsApi";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-700">
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-primary blur-[60px] opacity-20 animate-pulse" />
      <div className="relative w-24 h-24 bg-white dark:bg-primary rounded-3xl flex items-center justify-center border border-white dark:border-neutral-900">
        <Coffee size={40} className="text-primary dark:text-white" />
      </div>
    </div>
    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
      Everything is quiet
    </h3>
    <p className="text-slate-500 dark:text-neutral-400 max-w-xs mx-auto text-sm font-medium leading-relaxed">
      You're all caught up for today. Enjoy your coffee!
    </p>
  </div>
);

// mapping حسب شكل Laravel notifications + mention + follow
const mapApiNotificationToUi = (item) => {
  const type = item.type; // App\\Notifications\\...
  const data = item.data || {};

  let simpleType = "comment";
  let badgeLabel = "COMMENT";

  if (type === "App\\Notifications\\ReactNotification") {
    simpleType = "reaction";
    badgeLabel = "REACTION";
  } else if (type === "App\\Notifications\\NewCommentNotification") {
    simpleType = "comment";
    badgeLabel = "COMMENT";
  } else if (type === "App\\Notifications\\MentionNotification") {
    simpleType = "mention";
    badgeLabel = "MENTION";
  } else if (type === "App\\Notifications\\FollowNotification") {
    simpleType = "follow";
    badgeLabel = "FOLLOW";
  }

  return {
    id: item.id,
    type, // النوع الكامل من Laravel
    simpleType,
    badgeLabel,
    username:
      data.username || data.user_name || data.author_name || "DevHub User",
    action:
      data.message ||
      data.action ||
      data.title ||
      (simpleType === "reaction"
        ? "reacted to your post"
        : simpleType === "mention"
          ? "mentioned you in a discussion"
          : simpleType === "follow"
            ? "started following you"
            : "left a new comment"),
    content: data.content || data.body || "",
    timestamp: item.created_at,
    avatar:
      data.avatar_url ||
      data.avatar ||
      `https://api.dicebear.com/7.x/thumbs/svg?seed=${item.id}`,
    isRead: !!item.read_at,
  };
};

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const list = await notificationsApi.getAllNotifications();
      const mapped = list.map(mapApiNotificationToUi);
      setNotifications(mapped);
    } catch (err) {
      console.error(err);
      setError("Failed to load notifications. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      await notificationsApi.markNotificationAsRead(id);
    } catch (err) {
      console.error(err);
      fetchNotifications();
    }
  };

  const handleDelete = (id) => {
    // محلي بس (مفيش delete في الـ API)
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = async () => {
    try {
      setActionLoading(true);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      await notificationsApi.markAllNotificationsAsRead();
    } catch (err) {
      console.error(err);
      fetchNotifications();
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("This will permanently clear your inbox. Ready?")) {
      return;
    }
    try {
      setActionLoading(true);
      await notificationsApi.clearAllNotifications();
      setNotifications([]);
    } catch (err) {
      console.error(err);
      fetchNotifications();
    } finally {
      setActionLoading(false);
    }
  };

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;

    const key = activeFilter; // all, comments, reactions, mentions, follows

    if (key === "comments") {
      return notifications.filter((n) => n.simpleType === "comment");
    }
    if (key === "reactions") {
      return notifications.filter((n) => n.simpleType === "reaction");
    }
    if (key === "mentions") {
      return notifications.filter((n) => n.simpleType === "mention");
    }
    if (key === "follows") {
      return notifications.filter((n) => n.simpleType === "follow");
    }

    return notifications;
  }, [notifications, activeFilter]);

  const filters = useMemo(
    () => [
      { key: "all", label: "All Feed", count: notifications.length },
      {
        key: "comments",
        label: "Comments",
        count: notifications.filter((n) => n.simpleType === "comment").length,
      },
      {
        key: "reactions",
        label: "Reactions",
        count: notifications.filter((n) => n.simpleType === "reaction").length,
      },
      {
        key: "mentions",
        label: "Mentions",
        count: notifications.filter((n) => n.simpleType === "mention").length,
      },
      {
        key: "follows",
        label: "Follows",
        count: notifications.filter((n) => n.simpleType === "follow").length,
      },
    ],
    [notifications],
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-white dark:bg-bg-primary-dark transition-colors duration-700">
      <NotificationFeed
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        unreadCount={unreadCount}
        totalCount={notifications.length}
        filters={filters}
        handleMarkAllAsRead={handleMarkAllAsRead}
        handleClearAll={handleClearAll}
        loading={loading || actionLoading}
        error={error}
      >
        {filteredNotifications.length > 0 ? (
          <div className="space-y-1 animate-in slide-in-from-bottom-4 fade-in duration-700">
            {filteredNotifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : !loading && !error ? (
          <EmptyState />
        ) : null}
      </NotificationFeed>
    </div>
  );
};

export default Notifications;
