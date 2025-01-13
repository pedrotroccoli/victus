import { useMutation, useQuery } from '@tanstack/react-query';
import { baseApi } from '../api';
import { SignInRequest, SignUpRequest, SignUpResponse } from './types';


export const useSignIn = () => useMutation({
  mutationFn: async (account: SignInRequest) => {
    const { data } = await baseApi.post(`/auth/sign-in`, {
      account
    });

    baseApi.defaults.headers.common.Authorization = `Bearer ${data.token}`;

    return data;
  }
})


export const useSignUp = () => useMutation({
  mutationFn: async (account: SignUpRequest) => {
    const { data } = await baseApi.post<SignUpResponse>(`/auth/sign-up`, {
      account
    });

    baseApi.defaults.headers.common.Authorization = `Bearer ${data.token}`;

    return data;
  }
})

export const useMe = () => useQuery({
  queryKey: ['me'],
  queryFn: async () => {
    const { data } = await baseApi.get(`/auth/me`);

    return data;
  }
})
