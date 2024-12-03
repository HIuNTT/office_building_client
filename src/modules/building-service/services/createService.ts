import { useMutation } from '@tanstack/react-query'
import { api } from 'configs/api'

export interface CreateServiceDto {
  code: number
  name: string
  type: string
  basePrice: number
  increasePercent: number
}

export async function createService(data: CreateServiceDto) {
  return (await api.post('/service/create', data)).data
}

export function useCreateService() {
  return useMutation({
    mutationFn: createService,
  })
}
