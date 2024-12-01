import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const Login = lazy(() => import('./pages/Login'))

export const authRoute: RouteObject = {
  path: '/auth',
  children: [
    {
      path: 'login',
      Component: Login,
    },
  ],
}
