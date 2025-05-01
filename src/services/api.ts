import axios from 'axios';
import { refreshToken, logout } from '../features/auth/authSlice';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export const initializeInterceptors = (store: any) => {
  api.interceptors.request.use((config) => {
  
    const state = store.getState();
    const accessToken = state.auth.accessToken || localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/auth/signup') &&
        !originalRequest.url.includes('/auth/signin') &&
        !originalRequest.url.includes('/auth/refresh')
      ) {
        originalRequest._retry = true;
        try {
          const result = await store.dispatch(refreshToken());
          if (refreshToken.fulfilled.match(result)) {
            const newAccessToken = result.payload.access_token;
            localStorage.setItem('accessToken', newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
          store.dispatch(logout());
          localStorage.removeItem('accessToken');
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default api;