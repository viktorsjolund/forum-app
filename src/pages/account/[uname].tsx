import { Header } from '@/components/header'
import { Loading } from '@/components/loading'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'

const Profile = () => {
  const router = useRouter()
  const { uname } = router.query as { uname: string }
  const { data, isLoading, error } = trpc.useQuery(['user.byUsername', { username: uname }])

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <span>User not found.</span>
  }

  return (
    <>
      <Header />
      <span>{data?.username}</span>
    </>
  )
}

export default Profile
