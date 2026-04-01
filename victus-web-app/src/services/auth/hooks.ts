import { useMutation, useQuery } from '@tanstack/react-query';
import { getMe, signIn, signUp, startSiweAuth, updateMe, verifySiweAuth } from './services';

export const useSignIn = () => useMutation({
  mutationFn: signIn
})

export const useSignUp = () => useMutation({
  mutationFn: signUp
})

//

export const useMe = () => useQuery({
  queryKey: ['me'],
  queryFn: getMe
})

export const useUpdateMe = () => useMutation({
  mutationFn: updateMe
})

//

export const useStartSiweAuth = () => useMutation({
  mutationFn: startSiweAuth
})

export const useVerifySiweAuth = () => useMutation({
  mutationFn: verifySiweAuth
})