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

// 🔴 1. الـ End Point الجديدة لإنشاء إجابة على سؤال معين
export async function createAnswer(questionId, content) {
  const res = await axiosInstance.post(`/questions/${questionId}/answers/create`, {
    content: content
  }, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  });
  return res.data; // بيرجع success, message, data (الأوبجكت الجديد للإجابة)
}

// 🔴 2. الـ End Point الجديدة لجلب تفاصيل إجابة محددة
export async function fetchAnswerDetails(questionId, answerId) {
  const res = await axiosInstance.get(`/questions/${questionId}/answers/${answerId}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  });
  return res.data; // بيرجع success, data
}

// 🔴 الـ End Point المضافة حديثاً للتصويت المباشر على إجابة معينة
export async function voteAnswer(questionId, answerId, vote_type) {
  const res = await axiosInstance.post(`/questions/${questionId}/answers/${answerId}/vote`, {
    vote_type: vote_type // "upvote" | "downvote"
  }, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  });
  return res.data; // بيرجع الـ data اللي فيها الـ vote_score و الـ current_user_vote
}
// 🔴 1. اند بوينت اعتماد الإجابة كحل صحيح لسؤالك
export async function acceptAnswer(questionId, answerId) {
  const res = await axiosInstance.post(`/questions/${questionId}/answers/${answerId}/accept`, {}, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  });
  return res.data; // بيرجع success, message, data
}

// 🔴 2. اند بوينت إلغاء اعتماد الإجابة كحل صحيح
export async function unacceptAnswer(questionId, answerId) {
  const res = await axiosInstance.post(`/questions/${questionId}/answers/${answerId}/unaccept`, {}, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  });
  return res.data; // بيرجع success, message, data
}

// 🔴 دالة الـ AI Chat الجديدة المتوافقة تماماً مع الـ Payload والـ Session المقترحة
export async function sendAIChatMessage(questionId, message, sessionId = null) {
  const payload = { message };
  if (sessionId) {
    payload.session_id = Number(sessionId);
  }

  const res = await axiosInstance.post(`/questions/${questionId}/ai-chat`, payload, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  });
  return res.data; // بيرجع success, session_id, content, model_used, processing_time_ms
}