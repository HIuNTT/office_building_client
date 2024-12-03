import { useMutation } from '@tanstack/react-query'
import { api } from 'configs/api'
import { Tokens } from 'types/user'

export interface LoginDto {
  username: string
  password: string
}

export interface LoginResponse {
  data: Tokens
}

export async function login(data: LoginDto) {
  return (await api.post<LoginResponse>('/auth/login', data)).data.data
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
  })
}
