import LoadingPage from 'components/common/LoadingPage'
import { useGetProfile } from 'modules/user/services/getProfile'
import { PropsWithChildren, useEffect, useState } from 'react'
import { useUser } from 'store/user'

export default function AuthLayout({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState<boolean>(true)

  const { auth, setUser, clear } = useUser()

  const getProfile = useGetProfile(!!auth.accessToken || !!auth.refreshToken)

  useEffect(() => {
    if (getProfile.data) {
      setUser(getProfile.data)
    }
    if (getProfile.isError) {
      clear()
    }
  }, [getProfile.data, getProfile.isError, setUser, clear])

  useEffect(() => {
    if (getProfile.isSuccess || getProfile.isError || !auth.accessToken) {
      setLoading(false)
    }
  }, [getProfile.isSuccess, getProfile.isError, auth.accessToken])

  if (!loading) {
    return children
  }

  return <LoadingPage />
}
