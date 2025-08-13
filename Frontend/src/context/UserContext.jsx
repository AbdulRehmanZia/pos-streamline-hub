import { createContext, useEffect, useMemo, useState } from "react";
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
      await api.post("/user/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Backend logout failed", err);
    }

    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const value = useMemo(
    () => ({ user, setUser, accessToken, setAccessToken, logout }),
    [user, accessToken]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
