import { UserOutlined } from '@ant-design/icons'
import { lazy } from 'react'
import { AppRoute } from 'routes'

const BuildingEmployee = lazy(() => import('./pages/Empoyee'))

export const employeeRoute: AppRoute = {
  path: '/employee',
  name: 'Quản lý nhân viên',
  icon: <UserOutlined />,
  showOnMenu: true,
  children: [
    { path: '/employee', redirect: '/employee/list' },
    { path: '/employee/list', name: 'Danh sách nhân viên', showOnMenu: true, Component: BuildingEmployee },
  ],
}
