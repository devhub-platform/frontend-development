const BASE_URL = "http://127.0.0.1:8000/api/v1";

const AUTH_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3YxL3JlZ2lzdGVyIiwiaWF0IjoxNzY5NjI0MjAwLCJleHAiOjE3Njk2Mjc4MDAsIm5iZiI6MTc2OTYyNDIwMCwianRpIjoiT1RBSjZSTWJ6YUEwNlRGUCIsInN1YiI6IjUiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.C4eI3c-24J-7L71yp5xlYXl3qjcPcfhUucFstWHQgXw";

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
