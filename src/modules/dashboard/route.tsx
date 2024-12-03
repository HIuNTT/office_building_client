import { HomeOutlined } from '@ant-design/icons'
import { lazy } from 'react'
import { AppRoute } from 'routes'

const Dashboard = lazy(() => import('./pages/Dashboard'))

export const dashboardRoute: AppRoute = {
  path: '/dashboard',
  name: 'Trang chủ',
  Component: Dashboard,
  showOnMenu: true,
  icon: <HomeOutlined />,
}
