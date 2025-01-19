import axios from "axios";

export const baseApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  headers: {
    'Access-Control-Allow-Origin': 'https://dev.victusjournal.com',
  }
});

let tries = 0;

baseApi.interceptors.request.use(async (config) => {
  // if (tries === 2) {
  //   tries = 0;
  //   config.headers.Authorization = undefined;
  //   removeToken();
  //   window.location.href = '/sign-in';

  //   return config;
  // }

  // if (config.headers.Authorization) {
  //   const token = String(config.headers.Authorization || '').split(' ')[1];

  //   if (token) return config;

  //   config.headers.Authorization = undefined;
  // }

  // const token = await getToken();

  // config.headers.Authorization = `Bearer ${token}`;

  return config;
});


baseApi.interceptors.response.use(async (config) => {
  return config;
}, (error) => {
  if (error.response.status === 401) {
    tries++;
  }
})

