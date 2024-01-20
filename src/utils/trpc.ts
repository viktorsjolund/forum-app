import { createTRPCNext } from '@trpc/next'
import type { AppRouter } from '@/pages/api/trpc/[trpc]'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // In the browser, we return a relative URL
    return ''
  }
  // When rendering on the server, we return an absolute URL

  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const trpc = createTRPCNext<AppRouter>({
  config(opts) {
    return {
      links: [
        httpBatchLink({
          url: getBaseUrl() + '/api/trpc',
          async headers() {
            return {
              cookie: opts.ctx?.req?.headers.cookie
            }
          }
        }),
      ],
      transformer: superjson
    }
  },
  ssr: true
})
