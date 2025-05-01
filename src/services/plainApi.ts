// src/app/plainApi.ts
import axios from 'axios';

const plainApi = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export default plainApi;
