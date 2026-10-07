import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;

interface ApiErrorResponse {
  message?: string | string[];
}

const getErrorMessage = (data: unknown): string => {
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as ApiErrorResponse).message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (typeof message === "string") {
      return message;
    }
  }

  return "Something went wrong";
};

export const register = async (data: RegisterRequest): Promise<AuthUser> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result: unknown = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(result));
  }

  return result as AuthUser;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result: unknown = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(result));
  }

  return result as LoginResponse;
};
