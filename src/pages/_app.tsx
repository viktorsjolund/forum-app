import '../styles/globals.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'inter-ui/inter.css'
import { trpc } from '@/utils/trpc'
import { AppType } from 'next/dist/shared/lib/utils'
import { RouteProtect } from '@/components/routeProtect'

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <RouteProtect>
      <Component {...pageProps} />
    </RouteProtect>
  )
}

export default trpc.withTRPC(MyApp)
