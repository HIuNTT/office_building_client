import { authRoute } from 'modules/auth/route'
import { useRoutes } from 'react-router-dom'

export default function Routes() {
  const element = useRoutes([
    {
      path: '',
      children: [authRoute],
    },
    {
      path: '*',
      element: <div>404</div>,
    },
  ])
  return element
}
