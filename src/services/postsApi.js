// src/services/postsApi.js
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

export async function createPost({
  title,
  content,
  // status: "published" | "draft"
  status = "published",
  read_time,
  tags = [],
  coverImageFile = null, // File | null
  imageFile = null, // File | null  (الصورة اللي جوه البوست نفسه)
  generated_image_id = null,
}) {
  const formData = new FormData();

  // required
  formData.append("title", title);
  formData.append("content", content);

  // optional fields
  if (status) formData.append("status", status);
  if (read_time) formData.append("read_time", String(read_time));
  if (generated_image_id) {
    formData.append("generated_image_id", String(generated_image_id));
  }

  // tags => tags[0]
  if (tags && tags.length > 0) {
    // الـ API كاتبة tags[0] array[string]
    formData.append("tags[0]", JSON.stringify(tags));
  }

  // cover_image (file)
  if (coverImageFile) {
    formData.append("cover_image", coverImageFile);
  }

  // image_url (file) الصورة اللي جوه البوست
  if (imageFile) {
    formData.append("image_url", imageFile);
  }

  const res = await axiosInstance.post("/posts", formData, {
    headers: {
      // خليه يسيب boundary لـ browser
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });

  return res.data; // { message, post }
}
