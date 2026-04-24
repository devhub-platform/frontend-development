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

// 1) كل اللغات المتاحة (string[])
export async function fetchCodeLanguages() {
  const res = await axiosInstance.get("/code/languages");
  // response: { success, data: [...], count }
  return res.data.data || [];
}

// 2) كل الـ runtimes (language + version + aliases + runtime?)
export async function fetchCodeRuntimes() {
  const res = await axiosInstance.get("/code/runtimes");
  // response: { success, data: [...], count }
  return res.data.data || [];
}

// 3) search عن runtime معين بالـ language
// search: string (مثلاً "php" أو "java 15")
export async function searchRuntimes(search) {
  const res = await axiosInstance.get("/code/search-runtimes", {
    params: { search },
  });
  // response sample اللي بعتّيه:
  // { success, search_term, data: [...], meta: {...} }
  return res.data;
}

// 4) Execute code
// payload: { language, version, code, stdin? }
export async function executeCode(payload) {
  const body = {
    language: payload.language,
    version: payload.version,
    code: payload.code,
  };

  if (payload.stdin !== undefined && payload.stdin !== null) {
    body.stdin = payload.stdin;
  }

  const res = await axiosInstance.post("/code/execute", body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  // response:
  // {
  //   success: true,
  //   language, version,
  //   run: { stdout, stderr, output, code, memory, cpu_time, wall_time, ... }
  // }
  return res.data;
}
