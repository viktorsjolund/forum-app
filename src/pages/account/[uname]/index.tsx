import { Loading } from '@/components/loading'
import { ProfileTemplate } from '@/components/profileTemplate'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'

const Profile = () => {
  const router = useRouter()
  const { uname } = router.query as { uname: string }
  const { data: user, isLoading, error } = trpc.useQuery(['user.byUsername', { username: uname }])
  const { data: posts } = trpc.useQuery(['post.all'])
  const { data: me } = trpc.useQuery(['user.me'])

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <span>User not found.</span>
  }

  return (
    <ProfileTemplate
      me={me}
      username={uname}
    >
      <h1>test</h1>
    </ProfileTemplate>
  )
}

export default Profile
