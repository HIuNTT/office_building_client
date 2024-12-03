import MainLayout from 'components/layout'
import AuthLayout from 'components/layout/AuthLayout'
import { authRoute } from 'modules/auth/route'
import { serviceRoute } from 'modules/building-service/route'
import { companyRoute } from 'modules/company/route'
import { dashboardRoute } from 'modules/dashboard/route'
import { employeeRoute } from 'modules/employee/route'
import { ReactNode } from 'react'

import { Navigate, NonIndexRouteObject, useRoutes } from 'react-router-dom'

export type AppRoute = NonIndexRouteObject & {
  path: string
  name?: string
  icon?: ReactNode
  showOnMenu?: boolean
  redirect?: string
  children?: AppRoute[]
}
// eslint-disable-next-line
export const routes: AppRoute[] = [dashboardRoute, companyRoute, serviceRoute, employeeRoute]

function formatRoutes(routes: AppRoute[]): NonIndexRouteObject[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return routes.map(({ name, icon, showOnMenu, redirect, children, ...rest }) => {
    if (redirect) {
      return {
        ...rest,
        element: <Navigate to={redirect} replace />,
      }
    }
    return {
      ...rest,
      children: children ? formatRoutes(children) : [],
    }
  })
}

export default function Routes() {
  console.log('render routes')

  const element = useRoutes([
    authRoute,
    {
      path: '/',
      element: (
        <AuthLayout>
          <MainLayout />
        </AuthLayout>
      ),
      children: formatRoutes(routes),
    },
    {
      path: '*',
      element: <div>404</div>,
    },
  ])
  return element
}
