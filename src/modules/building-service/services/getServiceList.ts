import { useQuery } from '@tanstack/react-query'
import { api } from 'configs/api'
import { PaginationResult } from 'types/getList'
import { Service } from 'types/service'

export interface ServiceListResponse {
  data: {
    items: Service[]
    meta: PaginationResult
  }
}

export interface ServiceListParams {
  limit?: number
  page?: number
  name?: string
  code?: number
  type?: string
  sortBy?: string
  order?: 'asc' | 'desc'
}

export async function getServiceList(params: ServiceListParams) {
  return (await api.get<ServiceListResponse>('/service/list', { params })).data.data
}

export function useGetServiceList(params: ServiceListParams) {
  return useQuery({
    queryKey: [
      'serviceList',
      params.name,
      params.code,
      params.type,
      params.limit,
      params.page,
      params.sortBy,
      params.order,
    ],
    queryFn: async () => await getServiceList(params),
  })
}
