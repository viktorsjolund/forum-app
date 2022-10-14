import { Header } from '@/components/header'
import { trpc } from '@/utils/trpc'

const Profile = () => {
  const user = trpc.useQuery(['user.me'])

  if (user.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Header />
      <div>
        <span>{user.data?.username}</span>
        <span>{user.data?.email}</span>
      </div>
    </>
  )
}

export default Profile
