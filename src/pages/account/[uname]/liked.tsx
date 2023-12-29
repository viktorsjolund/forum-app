import { Loading } from '@/components/loading'
import { MinifiedPost } from '@/components/minifiedPost'
import { ProfileTemplate } from '@/components/profileTemplate'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Liked = () => {
  const router = useRouter()
  const { uname } = router.query as { uname: string }
  const { data: me } = trpc.useQuery(['user.me'])
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError
  } = trpc.useQuery(['user.byUsername', { username: uname }])
  const {
    data: posts,
    isLoading: isPostsLoading,
    refetch
  } = trpc.useQuery(['post.byUserLikes', { userId: user?.id! }], { enabled: false })

  useEffect(() => {
    if (user) {
      refetch()
    }
  }, [user, refetch])

  if (isUserLoading || isPostsLoading) {
    return <Loading />
  }

  if (userError) {
    return <span>User not found.</span>
  }

  return (
    <ProfileTemplate
      me={me}
      username={uname}
    >
      <div className='flex flex-col'>
        {posts?.map((post) => (
          <MinifiedPost
            key={post.id}
            post={post}
          />
        ))}
      </div>
    </ProfileTemplate>
  )
}

export default Liked
