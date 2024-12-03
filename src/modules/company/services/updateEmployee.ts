import { api } from 'configs/api'
import { useMutation } from '@tanstack/react-query'
import { CreateCompanyEmployeeDto } from './createEmployee'

export interface UpdateCompanyEmployeeDto extends CreateCompanyEmployeeDto {
  id: string
}

export async function updateCompanyEmployee(data: UpdateCompanyEmployeeDto) {
  return (await api.put('/company-employee/update', data)).data
}

export function useUpdateCompanyEmployee() {
  return useMutation({
    mutationFn: updateCompanyEmployee,
  })
}
