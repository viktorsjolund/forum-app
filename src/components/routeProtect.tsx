import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Loading } from './loading'

const permittedRoutes = ['/login', '/register']

export const RouteProtect = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { data: isAuthorized, isLoading, refetch } = trpc.user.isAuthorized.useQuery()

  useEffect(() => {
    if (typeof isAuthorized !== 'undefined') {
      if (!isAuthorized && !permittedRoutes.includes(router.pathname)) {
        router.push('/login')
      } else if (isAuthorized && router.pathname === '/login') {
        router.push('/')
      }
      refetch()
    }
  }, [isAuthorized, refetch, router])

  if (isLoading) {
    return <Loading />
  }

  return <>{children}</>
}
