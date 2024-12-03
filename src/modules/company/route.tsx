import { BuildOutlined } from '@ant-design/icons'
import { lazy } from 'react'
import { AppRoute } from 'routes'

const Company = lazy(() => import('./pages/Company'))
const CompanyEmployees = lazy(() => import('./pages/CompanyEmployee'))

export interface CompanyParams {
  companyId: string
}

export const companyRoute: AppRoute = {
  path: '/company',
  name: 'Quản lý công ty',
  icon: <BuildOutlined />,
  showOnMenu: true,
  children: [
    { path: '/company', redirect: '/company/list' },
    { path: '/company/list', name: 'Danh sách công ty', showOnMenu: true, Component: Company },
    { path: '/company/:companyId', Component: CompanyEmployees },
    // { path: '/company/add', name: 'Danh sách công ty', showOnMenu: true, element: ' công ty' },
  ],
}
