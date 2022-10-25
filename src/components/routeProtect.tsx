import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Loading } from './loading'

const permittedRoutes = ['/account/login' , '/account/register']

export const RouteProtect = ({ children }: { children: any }) => {
  const router = useRouter()
  const { data: isAuthorized, isLoading, refetch } = trpc.useQuery(['user.isAuthorized'])

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthorized && !permittedRoutes.includes(router.pathname)) {
        router.push('/account/login')
      } else if (isAuthorized && router.pathname === '/account/login') {
        router.push('/')
      }
      refetch()
    }
  }, [isAuthorized, refetch, isLoading, router])

  if (isLoading) {
    return <Loading />
  }

  return children
}
