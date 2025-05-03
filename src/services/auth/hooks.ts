import { useMutation, useQuery } from '@tanstack/react-query';
import { baseApi } from '../api';
import { signIn, signUp, startSiweAuth, verifySiweAuth } from './services';


export const useSignIn = () => useMutation({
  mutationFn: signIn
})

export const useSignUp = () => useMutation({
  mutationFn: signUp
})

export const useMe = () => useQuery({
  queryKey: ['me'],
  queryFn: async () => {
    const { data } = await baseApi.get(`/me`);

    return data;
  }
})


//

export const useStartSiweAuth = () => useMutation({
  mutationFn: startSiweAuth
})

export const useVerifySiweAuth = () => useMutation({
  mutationFn: verifySiweAuth
})