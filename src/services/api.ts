import axios from "axios";
import { getToken, removeToken } from "./auth/services";

export const baseApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  headers: {
    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' ? '*' : 'https://dev.victusjournal.com',
    'ngrok-skip-browser-warning': true,
  }
});

let tries = 0;

baseApi.interceptors.request.use(async (config) => {
  if (tries === 2) {
    removeToken();
    config.headers.Authorization = undefined;
    window.location.href = '/sign-in';

    tries = 0;

    return config;
  }

  if (config.headers.Authorization) {
    const token = String(config.headers.Authorization || '').split(' ')[1];

    if (token) return config;

    config.headers.Authorization = undefined;
  }

  const token = await getToken();

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});


baseApi.interceptors.response.use(async (config) => {
  return config;
}, (error) => {
  if (error?.response?.status === 401 && error?.config?.url !== '/auth/sign-in') {
    tries++;
  }
})

