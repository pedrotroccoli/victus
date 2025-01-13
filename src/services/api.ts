import axios from "axios";
import { getToken } from "./auth/services";

export const baseApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
});

baseApi.interceptors.request.use(async (config) => {
  if (config.headers.Authorization) return config;

  const token = await getToken();

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

