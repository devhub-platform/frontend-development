// src/services/qaApi.js
import axiosInstance from "../config/api";

// interceptor للهيدرز والتوكن
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = "application/json";
  return config;
});

export async function fetchQuestions({ tab, page = 1, per_page = 5 }) {
  let sortParam = "";

  // mapping الـ Tabs لـ query parameters بتاعة الباك إند
  switch (tab) {
    case "Highest Score":
      sortParam = "votes";
      break;
    case "Most Viewed":
      sortParam = "views";
      break;
    case "Trending":
      sortParam = "hot";
      break;
    case "Unanswered":
      sortParam = "unanswered";
      break;
    default:
      sortParam = ""; // Newest (Default)
  }

  const res = await axiosInstance.get(`/questions`, {
    params: {
      sort_by: sortParam,
      page: page,
      per_page: per_page,
    },
  });
  return res.data;
}

export async function fetchHotQuestions() {
  const res = await axiosInstance.get(`/questions/hot`);
  return res.data.data || [];
}

// 3) سؤال واحد بالتفاصيل
export async function fetchQuestionById(id) {
  const res = await axiosInstance.get(`/questions/${id}`);
  return res.data.data;
}

// تصويت على سؤال
export async function voteQuestion(id, vote_type) {
  const res = await axiosInstance.post(`/questions/${id}/vote`, {
    vote_type,
  });
  return res.data.data;
}

// إنشاء سؤال جديد (multipart/form-data)
export async function createQuestion(payload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("content", payload.content);

  (payload.tags || []).forEach((tag) => {
    formData.append("tags[]", tag);
  });

  (payload.images || []).forEach((file) => {
    formData.append("images[]", file);
  });

  const res = await axiosInstance.post("/questions/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

// 🔴 الـ End Point الجديدة للـ Filtering بالـ Tag
export async function fetchQuestionsByTag(tagName) {
  const res = await axiosInstance.get(`/questions/by-tag/${tagName}`);
  return res.data; // بيرجع الـ object اللي فيه success, tag, data
}

// 🔴 الـ End Point الجديدة لجلب بيانات مشاركة السؤال
export async function fetchQuestionShareData(id) {
  const res = await axiosInstance.get(`/questions/${id}/share`);
  return res.data; // بيرجع success و داتا الـ url, slug_url, title, tags
}