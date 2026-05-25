import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Unwrap the backend's ApiResponse<T> envelope so callers receive T directly
api.interceptors.response.use(
  (response) => {
    // Backend always responds { success, data, message, timestamp }
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'An unexpected error occurred';
    console.error('API Error:', message);

    // Surface 409 Conflict as a readable toast — used by client delete
    if (error.response?.status === 409) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
