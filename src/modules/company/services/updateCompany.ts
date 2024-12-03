import { api } from 'configs/api'
import { CreateCompanyDto } from './createCompany'
import { useMutation } from '@tanstack/react-query'

export interface UpdateCompanyDto extends CreateCompanyDto {
  _id: string
}

export async function updateCompany(data: UpdateCompanyDto) {
  return (await api.put('/company/update', data)).data
}

export function useUpdateCompany() {
  return useMutation({
    mutationFn: updateCompany,
  })
}
