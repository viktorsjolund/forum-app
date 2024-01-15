import { Loading } from '@/components/loading'
import { MinifiedPost } from '@/components/minifiedPost'
import { PaginationButtons } from '@/components/paginationButtons'
import { ProfileTemplate } from '@/components/profileTemplate'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
const POST_LIMIT = 2 as const

const Liked = () => {
  const router = useRouter()
  const { uname, page } = router.query as { uname: string; page?: string }
  let pageNr = page ? parseInt(page) : 1
  if (isNaN(pageNr)) {
    pageNr = 1
  } else if (pageNr < 1) {
    pageNr = 1
  }

  const { data: me } = trpc.useQuery(['user.me'])
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError
  } = trpc.useQuery(['user.byUsername', { username: uname }])
  const {
    data: posts,
    isLoading: isPostsLoading,
    refetch: refetchLikes
  } = trpc.useQuery(
    ['post.byUserLikes', { userId: user?.id!, skip: (pageNr - 1) * POST_LIMIT, take: POST_LIMIT }],
    { enabled: false }
  )
  const { data: postCount, refetch: refetchCount } = trpc.useQuery(
    ['post.countByUserLikes', { userId: user?.id! }],
    {
      enabled: false
    }
  )

  useEffect(() => {
    if (user) {
      refetchLikes()
      refetchCount()
    }
  }, [user, refetchLikes, refetchCount])

  if (isUserLoading || isPostsLoading) {
    return <Loading />
  }

  if (userError) {
    return <span>User not found.</span>
  }

  const handleNewPage = () => {
    refetchLikes()
  }

  const handleRatingChange = () => {
    refetchCount()
  }

  return (
    <ProfileTemplate
      me={me}
      username={uname}
    >
      <div className='p-5'>
        {postCount && (
          <PaginationButtons
            handleNewPage={handleNewPage}
            pageNr={pageNr}
            postCount={postCount}
            postLimit={POST_LIMIT}
          />
        )}
        <div className='flex flex-col'>
          {posts?.map((post) => (
            <MinifiedPost
              key={post.id}
              post={post}
              ratingChangeCb={handleRatingChange}
            />
          ))}
        </div>
      </div>
    </ProfileTemplate>
  )
}

export default Liked
