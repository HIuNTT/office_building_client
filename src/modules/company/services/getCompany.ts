import { useQuery } from '@tanstack/react-query'
import { api } from 'configs/api'
import { Company } from 'types/company'

export interface CompanyResponse {
  data: Company
}

export async function getCompany(id: string) {
  return (await api.get<CompanyResponse>(`/company/${id}`)).data.data
}

export function useGetCompany(id: string) {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => getCompany(id),
  })
}
