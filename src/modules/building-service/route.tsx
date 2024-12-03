import { AuditOutlined } from '@ant-design/icons'
import { lazy } from 'react'
import { AppRoute } from 'routes'

const Service = lazy(() => import('./pages/Service'))

export const serviceRoute: AppRoute = {
  path: '/service',
  name: 'Quản lý dịch vụ',
  icon: <AuditOutlined />,
  showOnMenu: true,
  children: [
    { path: '/service', redirect: '/service/list' },
    { path: '/service/list', name: 'Danh sách dịch vụ', showOnMenu: true, Component: Service },
  ],
}
