import { useMutation } from '@tanstack/react-query'
import { api } from 'configs/api'

export async function deleteService(serviceId: string) {
  return await api.delete(`/service/${serviceId}`)
}

export function useDeleteService() {
  return useMutation({
    mutationFn: deleteService,
  })
}
