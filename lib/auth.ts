export const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getUser(): { id: string; email: string } | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { id: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}
