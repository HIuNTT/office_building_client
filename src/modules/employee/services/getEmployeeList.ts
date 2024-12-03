import { useQuery } from '@tanstack/react-query'
import { api } from 'configs/api'
import { BuildingEmployee } from 'types/employee'
import { PaginationResult } from 'types/getList'

export interface BuildingEmployeeListResponse {
  data: {
    items: BuildingEmployee[]
    meta: PaginationResult
  }
}

export interface BuildingEmployeeListParams {
  name?: string
  code?: string
  limit?: number
  page?: number
  level?: string
}

export async function getBuildingEmployeeList(params: BuildingEmployeeListParams) {
  return (await api.get<BuildingEmployeeListResponse>('/employee/list', { params })).data.data
}

export function useGetBuildingEmployeeList(params: BuildingEmployeeListParams) {
  return useQuery({
    queryKey: ['buildingEmployeeList', params.name, params.code, params.limit, params.page, params.level],
    queryFn: async () => await getBuildingEmployeeList(params),
  })
}
