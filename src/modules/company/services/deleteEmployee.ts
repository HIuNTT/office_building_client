import { useMutation } from '@tanstack/react-query'
import { api } from 'configs/api'

export async function deleteCompanyEmployee(employeeId: string) {
  return await api.delete(`/company-employee/${employeeId}`)
}

export function useDeleteCompanyEmployee() {
  return useMutation({
    mutationFn: deleteCompanyEmployee,
  })
}
