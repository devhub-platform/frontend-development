const BASE_URL = "http://127.0.0.1:8000/api/v1";

const AUTH_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3YxL3JlZ2lzdGVyIiwiaWF0IjoxNzY5MzY1MzgzLCJleHAiOjE3NjkzNjg5ODMsIm5iZiI6MTc2OTM2NTM4MywianRpIjoibWd5RUpCVFAxNFZyMk0xWCIsInN1YiI6IjIwIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.WxAM7IKQ-hsSLdzXGPAVdDK_docwIPtVxuE5Dw4NQ-A";

export async function getRuntimes() {
  try {
    const response = await fetch(`${BASE_URL}/code/runtimes`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching runtimes:", error);
    return [];
  }
}

export async function runCode({ language, version, code, stdin }) {
  const response = await fetch(`${BASE_URL}/code/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    body: JSON.stringify({
      language,
      version,
      code,
      stdin, // هنا بنبعت الـ user input للباك
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to execute code");
  }

  return await response.json();
}
