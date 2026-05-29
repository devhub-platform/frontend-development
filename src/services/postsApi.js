// src/services/postsApi.js
import axiosInstance from "../config/api";

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = "application/json";
  return config;
});

export async function createPost({
  title,
  content,
  status = "published",
  read_time,
  tags = [],
  coverImageFile = null,
  imageFiles = [], // الـ Array كاملة اللي جاية من الـ components
  generated_image_id = null,
  imageUrl = null,
}) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("content", content);

  if (status) formData.append("status", status);
  if (read_time != null) formData.append("read_time", String(read_time));
  if (generated_image_id != null) {
    formData.append("generated_image_id", String(generated_image_id));
  }

  // إرسال الـ tags زي ما هي متجربة في الـ API doc عندك tags[0]
  if (tags && tags.length > 0) {
    formData.append("tags[0]", JSON.stringify(tags));
  }

  // الـ Cover Image كـ File منفرد
  if (coverImageFile) {
    formData.append("cover_image", coverImageFile);
  }

  /* 🔴 حل المشكلة الأساسية:
    الباك إند مستني image_url تكون Array. 
    هنلف على الـ imageFiles ونضيفهم كلهم بـ Key اسمه image_url[]
  */
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => {
      formData.append("image_url[]", file);
    });
  } else if (imageUrl) {
    // لو مبعوت string URL عادي، بنحطه برضه جوه الـ Array عشان الـ validation
    formData.append("image_url[]", imageUrl);
  }

  try {
    const res = await axiosInstance.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    return res.data;
  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data || {};
    const message =
      data.message ||
      data.error ||
      `Failed to create post (status ${status || "unknown"})`;
    console.error("createPost error:", err);
    throw { ...err, friendlyMessage: message };
  }
}
