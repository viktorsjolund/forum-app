import { Loading } from '@/components/loading'
import { MinifiedPost } from '@/components/minifiedPost'
import { PaginationButtons } from '@/components/paginationButtons'
import { ProfileTemplate } from '@/components/profileTemplate'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
const POST_LIMIT = 2 as const

const Profile = () => {
  const router = useRouter()
  const { uname, page } = router.query as { uname: string; page?: string }
  let pageNr = page ? parseInt(page) : 1
  if (isNaN(pageNr)) {
    pageNr = 1
  } else if (pageNr < 1) {
    pageNr = 1
  }

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError
  } = trpc.useQuery(['user.byUsername', { username: uname }])
  const {
    data: posts,
    isLoading: isPostsLoading,
    refetch: refetchPosts
  } = trpc.useQuery(
    ['post.byUser', { userId: user?.id!, skip: (pageNr - 1) * POST_LIMIT, take: POST_LIMIT }],
    { enabled: false }
  )
  const { data: postCount, refetch: refetchCount } = trpc.useQuery(
    ['post.countByUser', { userId: user?.id! }],
    {
      enabled: false
    }
  )
  const { data: me } = trpc.useQuery(['user.me'])

  useEffect(() => {
    if (user) {
      refetchPosts()
      refetchCount()
    }
  }, [user, refetchPosts, refetchCount])

  if (isUserLoading || isPostsLoading) {
    return <Loading />
  }

  if (userError) {
    return <span>User not found.</span>
  }

  const handleNewPage = () => {
    refetchPosts()
  }

  return (
    <ProfileTemplate
      me={me}
      username={uname}
    >
      <div className='p-5'>
        {!!postCount && (
          <div className='mb-5'>
            <PaginationButtons
              handleNewPage={handleNewPage}
              pageNr={pageNr}
              postCount={postCount}
              postLimit={POST_LIMIT}
            />
          </div>
        )}
        <div className='flex flex-col bg-midnight-light rounded p-2 border-[1px] border-midnight-lighter'>
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className='mb-2 last:mb-0'
              >
                <MinifiedPost post={post} />
              </div>
            ))
          ) : (
            <div>no results</div>
          )}
        </div>
        {!!postCount && (
          <div className='mt-5'>
            <PaginationButtons
              handleNewPage={handleNewPage}
              pageNr={pageNr}
              postCount={postCount}
              postLimit={POST_LIMIT}
            />
          </div>
        )}
      </div>
    </ProfileTemplate>
  )
}

export default Profile
