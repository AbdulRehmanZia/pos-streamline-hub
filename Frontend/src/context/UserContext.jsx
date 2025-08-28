import { createContext, useEffect, useState } from "react";
import { api } from "../Instance/api";

export const UserContext = createContext(null);

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("accessToken") || null;
  });

  // Keep storage in sync
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    else localStorage.removeItem("accessToken");
  }, [accessToken]);

  const logout = async () => {
    try {
      await api.post("/user/logout");
      setUser(null);
      setAccessToken(null);
      localStorage.clear();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await api.post("/user/refresh-token");
      const { accessToken: newAccessToken } = response.data.data;
      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (err) {
      console.error("Token refresh failed", err);
      logout();
      throw err;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, accessToken, setAccessToken, logout, refreshToken }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;