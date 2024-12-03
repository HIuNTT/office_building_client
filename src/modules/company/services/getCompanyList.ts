import { useQuery } from '@tanstack/react-query'
import { api } from 'configs/api'
import { Company } from 'types/company'
import { PaginationResult } from 'types/getList'

export interface CompanyListResponse {
  data: {
    items: Company[]
    meta: PaginationResult
  }
}

export interface CompanyListParams {
  name?: string
  limit?: number
  page?: number
}

export async function getCompanyList(params: CompanyListParams) {
  return (await api.get<CompanyListResponse>('/company/list', { params })).data.data
}

export function useGetCompanyList(params: CompanyListParams) {
  return useQuery({
    queryKey: ['companyList', params.name, params.limit, params.page],
    queryFn: async () => await getCompanyList(params),
  })
}
