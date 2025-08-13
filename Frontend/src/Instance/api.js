// import axios from "axios";

// export const api = axios.create({
//     baseURL: "http://localhost:5000/api/v1/",
// })

import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api/v1/",
  withCredentials: true, // keep true if backend sets cookies at all
});

// Attach access token from localStorage (works even before Context is ready)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
