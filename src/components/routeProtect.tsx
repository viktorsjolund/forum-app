import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Loading } from './loading'

const permittedRoutes = ['/api/auth/signin']

export const RouteProtect = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { data: isAuthorized, isLoading, refetch } = trpc.user.isAuthorized.useQuery()
  const { data: me, isLoading: meIsLoading, refetch: meRefetch } = trpc.user.me.useQuery()

  useEffect(() => {
    if (typeof isAuthorized !== 'undefined') {
      if (!isAuthorized && !permittedRoutes.includes(router.pathname)) {
        router.push('/api/auth/signin')
      } else if (me && !me.username && router.pathname !== '/user-setup') {
        router.push('/user-setup')
      } else if (me && me.username && router.pathname === '/user-setup') {
        router.push('/')
      } else if (router.asPath === '/user-setup#') {
        meRefetch()
      }
      refetch()
    }
  }, [isAuthorized, refetch, router, me, meRefetch])

  if (isLoading || meIsLoading) {
    return <Loading />
  }

  return <>{children}</>
}
