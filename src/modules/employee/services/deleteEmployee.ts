import { useMutation } from '@tanstack/react-query'
import { api } from 'configs/api'

export async function deleteEmployee(employeeId: string) {
  return await api.delete(`/employee/${employeeId}`)
}

export function useDeleteEmployee() {
  return useMutation({
    mutationFn: deleteEmployee,
  })
}
