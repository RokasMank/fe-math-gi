import axios from "axios";

// Determine the base URL based on the hostname
const isLocalhost = window.location.hostname === "localhost";
const baseURL = isLocalhost
  ? "https://localhost:7222" // Development backend
  : "http://158.129.2.190:5000"; // Production backend (no trailing slash)

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include authorization token or handle other logic
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Example: Get token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      console.error("Unauthorized access, redirecting to login...");
      // Example: window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const api = {
  get: (url, params) => apiClient.get(url, { params }),
  post: (url, data) => apiClient.post(url, data),
  put: (url, data) => apiClient.put(url, data),
  delete: (url) => apiClient.delete(url),
};

export default api;
