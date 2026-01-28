import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/v1";
const USE_MOCK_DATA = true;

const mockNotifications = [
  {
    id: "1",
    type: "App\\Notifications\\NewCommentNotification",
    data: {
      username: "Ahmed Ali",
      message: "commented on your post",
      content: "Great work! 🔥",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read_at: null,
  },
  {
    id: "2",
    type: "App\\Notifications\\ReactNotification",
    data: {
      username: "Sara Mohamed",
      message: "liked your comment",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read_at: null,
  },
  {
    id: "3",
    type: "App\\Notifications\\NewCommentNotification",
    data: {
      username: "Omar Hassan",
      message: "replied to your comment",
      content: "I totally agree with you 👍",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read_at: new Date().toISOString(),
  },
  {
    id: "4",
    type: "App\\Notifications\\MentionNotification",
    data: {
      username: "Mona Adel",
      message: "mentioned you in a post",
      content: "@you check this discussion!",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read_at: null,
  },
  {
    id: "5",
    type: "App\\Notifications\\FollowNotification",
    data: {
      username: "New Follower",
      message: "started following you",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read_at: null,
  },
];

const AUTH_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3YxL3JlZ2lzdGVyIiwiaWF0IjoxNzY5NTkyOTc3LCJleHAiOjE3Njk1OTY1NzcsIm5iZiI6MTc2OTU5Mjk3NywianRpIjoiVUU3ZE5Qcmhzc2JRTmluQSIsInN1YiI6IjQiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.7ib7RbytO7SXc8HwfNWRJp0ya35fxdTgOZ02wMHhHM4";

// axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// interceptor للـ token
api.interceptors.request.use((config) => {
  config.headers = {
    ...(config.headers || {}),
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${AUTH_TOKEN}`,
  };
  return config;
});

// wrapper موحّد
async function request(config) {
  try {
    const res = await api(config);
    return res.data;
  } catch (error) {
    console.error("Notification API error:", error);
    throw error;
  }
}

export async function getAllNotifications() {
  if (USE_MOCK_DATA) {
    return mockNotifications;
  }

  const data = await request({
    url: "/notifications/all",
    method: "GET",
  });

  return data.all_notifications || [];
}

export async function getNewCommentNotifications() {
  const data = await request({
    url: "/notifications",
    method: "GET",
  });

  return data.new_comment_notifications || [];
}

export async function getReactNotifications() {
  const data = await request({
    url: "/notifications/reacts",
    method: "GET",
  });

  return data.new_react_notifications || [];
}

export async function markAllNotificationsAsRead() {
  if (USE_MOCK_DATA) {
    return { success: true };
  }

  return await request({
    url: "/notifications/mark-as-read",
    method: "POST",
  });
}

export async function clearAllNotifications() {
  if (USE_MOCK_DATA) {
    return { success: true };
  }

  return await request({
    url: "/notifications/clear",
    method: "DELETE",
  });
}

export async function markNotificationAsRead(id) {
  if (USE_MOCK_DATA) {
    return { success: true };
  }

  return await request({
    url: `/notifications/${id}/mark-as-read`,
    method: "POST",
  });
}

const notificationsApi = {
  getAllNotifications,
  getNewCommentNotifications,
  getReactNotifications,
  markAllNotificationsAsRead,
  clearAllNotifications,
  markNotificationAsRead,
};

export default notificationsApi;