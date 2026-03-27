// const BASE_URL = "http://localhost:5000/api";
export const BASE_URL = "https://hr-backend-ashy.vercel.app/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("perfy_employee_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      console.error("Authentication error");
    }
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}
