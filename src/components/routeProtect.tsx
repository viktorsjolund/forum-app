import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Loading } from './loading'

export const RouteProtect = ({ children }: any) => {
  const router = useRouter()
  const { data: user, isLoading, refetch } = trpc.useQuery(['user.me'])

  useEffect(() => {
    if (!isLoading) {
      if (!user && router.pathname !== '/account/login') {
        router.push('/account/login')
      } else if (user && router.pathname === '/account/login') {
        router.push('/')
      }
      refetch()
    }
  }, [user, refetch, isLoading, router])

  if (isLoading) {
    return <Loading />
  }

  return children
}
