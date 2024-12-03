import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ConfigProvider } from 'antd'
import LoadingPage from 'components/common/LoadingPage'
import { queryClient } from 'configs/queryClient'
import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routes from 'routes'
import { Toaster } from 'sonner'
import { theme } from 'styles/theme'
import vi_VN from 'antd/locale/vi_VN'

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider locale={vi_VN} componentSize="middle" theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<LoadingPage />}>
            <Routes />
          </Suspense>
          <ReactQueryDevtools />
          <Toaster position="bottom-right" richColors />
        </QueryClientProvider>
      </ConfigProvider>
    </BrowserRouter>
  )
}

export default App
