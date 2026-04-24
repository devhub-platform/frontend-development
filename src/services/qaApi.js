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

export async function fetchQuestions({ tab, page = 1, per_page = 15 }) {
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
  // الـ API بيرجع { success, data: {...} }
  return res.data.data;
}

// تصويت على سؤال
// vote_type = "upvote" | "downvote"
export async function voteQuestion(id, vote_type) {
  const res = await axiosInstance.post(`/questions/${id}/vote`, {
    vote_type, // "upvote" | "downvote"
  });
  // API sample:
  // { success: true, message: "Vote recorded", data: { question_id, vote_score, current_user_vote } }
  return res.data.data;
}

// إنشاء سؤال جديد (multipart/form-data)
// payload: { title, content, tags: string[], images: File[] }
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
      // خلي axios يسيب الـ boundary
      "Content-Type": "multipart/form-data",
    },
  });

  // response sample اللي بعتِيه
  // { success: true, message: "...", data: { id, title, content, slug, ... } }
  return res.data;
}