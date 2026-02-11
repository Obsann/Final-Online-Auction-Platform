import axios from "axios";

// Use environment variable for API URL, fallback to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE_URL = API_BASE_URL;

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Changed from 'authToken' to 'token' to match Login.jsx
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: Auto-logout on 401
    if (error.response && error.response.status === 401) {
      // localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth Helpers
export const loginUser = async (credentials) => {
  const { data } = await api.post("/api/auth/login", credentials);
  return data;
};

export const registerUser = async (formData) => {
  // Check if it's FormData (for file uploads) or JSON
  const isFormData = formData instanceof FormData;

  const { data } = await api.post("/api/auth/register", formData, {
    headers: {
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    },
  });
  return data;
};

export default api;
