import { api } from 'configs/api'
import { CreateEmployeeDto } from './createEmployee'
import { useMutation } from '@tanstack/react-query'

export interface UpdateEmployeeDto extends CreateEmployeeDto {
  id: string
}

export async function updateEmployee(data: UpdateEmployeeDto) {
  return await api.put('/employee/update', data)
}

export function useUpdateEmployee() {
  return useMutation({
    mutationFn: updateEmployee,
  })
}
