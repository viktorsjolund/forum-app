import { ProfileTemplate } from '@/components/profileTemplate'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'

const Liked = () => {
  const router = useRouter()
  const { uname } = router.query as { uname: string }
  const { data: user } = trpc.useQuery(['user.me'])

  return (
    <ProfileTemplate
      me={user}
      username={uname}
    >
      <h1>test</h1>
    </ProfileTemplate>
  )
}

export default Liked
