import '../styles/globals.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'inter-ui/inter.css'
import { withTRPC } from '@trpc/next'
import { AppType } from 'next/dist/shared/lib/utils'
import type { AppRouter } from '@/server/routers/_app'
import { RouteProtect } from '@/components/routeProtect'

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <RouteProtect>
      <Component {...pageProps} />
    </RouteProtect>
  )
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc'

    return {
      url,
      headers() {
        return {
          cookie: ctx?.req?.headers.cookie,
        }
      },
    }
  },
  ssr: true,
})(MyApp)
