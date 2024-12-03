import { useMutation } from '@tanstack/react-query'
import { api } from 'configs/api'
import { Dayjs } from 'dayjs'

export interface CreateEmployeeDto {
  code: string
  name: string
  birthday: string | Dayjs
  address: string
  phone: string
  level: string
  position: string
  baseSalary: number
}

export async function createEmployee(data: CreateEmployeeDto) {
  return await api.post('/employee/create', data)
}

export function useCreateEmployee() {
  return useMutation({
    mutationFn: createEmployee,
  })
}
