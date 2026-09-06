import axios from 'axios';

export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);
