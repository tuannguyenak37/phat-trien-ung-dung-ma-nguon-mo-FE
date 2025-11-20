// app/providers.tsx
'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function Providers({ children }: { children: React.ReactNode }) {
  // Tạo client một lần duy nhất khi component mount
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Dữ liệu được coi là "tươi" trong 1 phút (không fetch lại ngay lập tức)
        staleTime: 60 * 1000, 
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}