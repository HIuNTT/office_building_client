import { useMutation } from '@tanstack/react-query'
import { api } from 'configs/api'
import { Dayjs } from 'dayjs'

export interface CreateCompanyEmployeeDto {
  code: string
  identityNumber: string
  name: string
  birthday: string | Dayjs
  phone: string
  companyId: string
}

export async function createCompanyEmployee(data: CreateCompanyEmployeeDto) {
  return (await api.post('/company-employee/create', data)).data
}

export function useCreateCompanyEmployee() {
  return useMutation({
    mutationFn: createCompanyEmployee,
  })
}
