import { useQuery } from '@tanstack/react-query'
import { api } from 'configs/api'
import { CompanyEmployee } from 'types/company'
import { PaginationResult } from 'types/getList'

export interface CompanyEmployeeResponse {
  data: {
    items: CompanyEmployee[]
    meta: PaginationResult
  }
}

export interface CompanyEmployeeParams {
  limit?: number
  page?: number
  name?: string
  companyId?: string
}

export async function getCompanyEmployeeList(params: CompanyEmployeeParams) {
  return (
    await api.get<CompanyEmployeeResponse>('/company-employee/list', {
      params,
    })
  ).data.data
}

export function useGetCompanyEmployeeList(params: CompanyEmployeeParams) {
  return useQuery({
    queryKey: ['companyEmployeeList', params.name, params.companyId, params.limit, params.page],
    queryFn: async () => await getCompanyEmployeeList(params),
  })
}
