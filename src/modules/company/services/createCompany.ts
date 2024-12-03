import { useMutation } from '@tanstack/react-query'
import { api } from 'configs/api'

export interface CreateCompanyDto {
  name: string
  taxCode: string
  capital: number
  industry: string
  employeeQuantity: number
  address: string
  phone: string
  area: number
}

export async function createCompany(data: CreateCompanyDto) {
  return (await api.post('/company/create', data)).data
}

export function useCreateCompany() {
  return useMutation({
    mutationFn: createCompany,
  })
}
