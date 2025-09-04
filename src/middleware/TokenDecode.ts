// utils/auth.ts
import { jwtDecode } from "jwt-decode";

// 🔹 Token Management
export const TOKEN_KEY = "sais";

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// 🔹 Decode Token
export const getSuperAdmin = (): String | null => {
  const token = getToken();

  if (!token) return null;
 
  return token
};

// 🔹 Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getSuperAdmin() !== null;
};

// 🔹 Logout function
export const logout = (): void => {
  removeToken();
  window.location.href = "/login";
};