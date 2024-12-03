import { LogoutOutlined } from '@ant-design/icons'
import { MenuDataItem, ProLayout } from '@ant-design/pro-components'
import { Avatar, Dropdown } from 'antd'
import LoadingPageItem from 'components/common/LoadingPageItem'
import { Suspense, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AppRoute, routes } from 'routes'
import { useUser } from 'store/user'

function formatMenu(items: AppRoute[]): MenuDataItem[] {
  return items
    .filter(({ showOnMenu }) => showOnMenu)
    .map(({ children, path, name, icon }) => ({
      path,
      name,
      icon,
      children: children && formatMenu(children),
    }))
}

export default function MainLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const user = useUser()

  useEffect(() => {
    if (pathname === '/') {
      navigate('/dashboard')
    }
  }, [pathname, navigate])

  return (
    <ProLayout
      layout="mix"
      logo={false}
      title="SeaHouse"
      actionsRender={() => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Đăng xuất',
                onClick: () => {
                  user.clear()
                  navigate('/auth/login')
                },
              },
            ],
          }}
        >
          <div className="flex items-center cursor-pointer px-2">
            <Avatar size={44} src={user.user.avatarUrl || '/images/male-130.png'} />
            <div className="ml-2 capitalize text-[16px]">{user.user.name}</div>
          </div>
        </Dropdown>
      )}
      token={{
        header: {
          heightLayoutHeader: 64,
        },
        sider: {
          colorMenuBackground: '#fff',
          colorBgMenuItemSelected: '#fff8f0',
          colorBgMenuItemActive: '#fff8f0',
          colorTextMenuSelected: '#c67c4e',
        },
        pageContainer: {
          paddingInlinePageContainerContent: 14,
          paddingBlockPageContainerContent: 20,
        },
      }}
      contentStyle={{ minHeight: 'calc(100vh - 64px)' }}
      menuDataRender={() => formatMenu(routes)}
      location={{ pathname }}
      menuItemRender={(item, dom) => (
        <div
          onClick={() => {
            if (pathname === item.path) return
            navigate(item.path || '')
          }}
        >
          {dom}
        </div>
      )}
      siderWidth={220}
      fixedHeader={true}
    >
      <Suspense fallback={<LoadingPageItem />}>
        <Outlet />
      </Suspense>
    </ProLayout>
  )
}
