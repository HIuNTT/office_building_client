import { useMutation } from '@tanstack/react-query'
import { api } from 'configs/api'

export async function deleteCompany(companyId: string) {
  return await api.delete(`/company/${companyId}`)
}

export function useDeleteCompany() {
  return useMutation({
    mutationFn: deleteCompany,
  })
}
