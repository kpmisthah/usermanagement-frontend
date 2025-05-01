import { Store } from '@reduxjs/toolkit';
import api from './api';
import { logout, reset } from '../features/auth/authSlice';
import { AppDispatch } from '../app/store';

export const setupInterceptors = (store: Store) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        (store.dispatch as AppDispatch)(logout());
        store.dispatch(reset());
        window.location.href = '/login';
      }
      return Promise.reject(error);
    },
  );
};