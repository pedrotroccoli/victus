import { baseApi } from "../api";
import { SignInRequest, SignUpRequest, SignUpResponse } from "./types";

// Session Management

let memoryToken = localStorage.getItem('@victus::token');

export const getToken = () => {
  const token = memoryToken || localStorage.getItem('@victus::token');

  return token;
}

export const setToken = async (token: string) => {
  localStorage.setItem('@victus::token', token);
  baseApi.defaults.headers.common.Authorization = `Bearer ${token}`;

  memoryToken = token;
}

export const removeToken = async () => {
  localStorage.removeItem('@victus::token');
  baseApi.defaults.headers.common.Authorization = undefined;

  memoryToken = null;
}

// Requests

export const signIn = async (account: SignInRequest) => {
  const { data } = await baseApi.post(`/auth/sign-in`, {
    account
  });

  setToken(data.token);

  return data;
}

export const signUp = async (account: SignUpRequest) => {
  const { data } = await baseApi.post<SignUpResponse>(`/auth/sign-up`, {
    account
  });

  setToken(data.token);

  return data;
}

export const signOut = async () => {
  await removeToken();
}
