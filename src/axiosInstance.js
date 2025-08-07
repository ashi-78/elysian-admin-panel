// src/utils/axios.js
import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8800/api"
      : "https://hotel-backend-gzn1.onrender.com/api",
  withCredentials: true,
});

// Log outgoing requests
API.interceptors.request.use((config) => {
  console.log(
    "[API Request]",
    config.method?.toUpperCase(),
    config.url,
    config.data || ""
  );
  return config;
});

// Log responses and errors
API.interceptors.response.use(
  (response) => {
    console.log("[API Response]", response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error(
      "[API Error]",
      error.response?.config?.url,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default API;
