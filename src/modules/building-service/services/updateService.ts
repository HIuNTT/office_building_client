import { api } from 'configs/api'
import { CreateServiceDto } from './createService'
import { useMutation } from '@tanstack/react-query'

export interface UpdateServiceDto extends CreateServiceDto {
  id: string
}

export async function updateService(data: UpdateServiceDto) {
  return (await api.post('/service/update', data)).data
}

export function useUpdateService() {
  return useMutation({
    mutationFn: updateService,
  })
}
