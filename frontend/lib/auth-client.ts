export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
export const SESSION_STORAGE_KEY = "portfolio-auth-session";

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export const readStoredSession = (): AuthSession | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession) as AuthSession;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
};

export const saveSession = (session: AuthSession): void => {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearSession = (): void => {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
};

export const requestJson = async <T,>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  const data = (await response.json().catch(() => ({}))) as T;

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;
    throw new Error(errorData.message ?? errorData.error ?? "Request failed");
  }

  return data;
};
