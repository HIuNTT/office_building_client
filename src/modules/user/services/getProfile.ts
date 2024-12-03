import { useQuery } from '@tanstack/react-query'
import { api } from 'configs/api'
import { User } from 'types/user'

export interface GetProfileResponse {
  data: User
}

export async function getProfile() {
  return (await api.get<GetProfileResponse>('/account/profile')).data.data
}

export function useGetProfile(enabled?: boolean) {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled,
  })
}
