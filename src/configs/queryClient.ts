import { keepPreviousData, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      placeholderData: keepPreviousData,
    },
    mutations: {
      onError(error: any) {
        toast.error(error.response.data.message || 'Có lỗi xảy ra. Vui lòng thử lại!')
      },
    },
  },
})
