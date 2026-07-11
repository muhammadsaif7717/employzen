import axios from "axios";

const isServer = typeof window === "undefined";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  // Use absolute URL on server, and relative URL (proxy) on the client to avoid CORS and cookie issues
  baseURL: isServer ? apiBaseUrl : "/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle token expiration or unauthorized requests
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Perform any global error handling here, e.g. checking for 401
    return Promise.reject(error);
  }
);

export default axiosInstance;
