import '../styles/globals.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { withTRPC } from '@trpc/next'
import { AppType } from 'next/dist/shared/lib/utils'
import type { AppRouter } from '@/server/routers/_app'
import { createTheme, ThemeProvider } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#5a189a',
      light: '#7b2cbf',
      dark: '#3c096c',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#ADB5BD',
      light: '#F8F9FA',
      dark: '#495057',
    },
    text: {
      primary: '#ffffff',
    },
  },
})

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc'

    return {
      url,
      headers() {
        return {
          cookie: ctx?.req?.headers.cookie
        }
      }
    }
  },
  ssr: true,
})(MyApp)
