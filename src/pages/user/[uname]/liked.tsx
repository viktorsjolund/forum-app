import { MinifiedPost } from '@/components/minifiedPost'
import { PaginationButtons } from '@/components/paginationButtons'
import { ProfileTemplate } from '@/components/profileTemplate'
import { usePageQueryParam } from '@/hooks/usePageQueryParam'
import { trpc } from '@/utils/trpc'
import { keepPreviousData } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
const POST_LIMIT = 2 as const

const Liked = () => {
  const router = useRouter()
  const { uname } = router.query as { uname: string }

  const [pageNr, setPageNr] = usePageQueryParam()
  const [isEnabled, setIsEnabled] = useState(false)
  const { data: me } = trpc.user.me.useQuery()
  const { data: user, error: userError } = trpc.user.byUsername.useQuery({ username: uname })
  const { data: posts, refetch: refetchLikes } = trpc.post.byUserLikes.useQuery(
    { userId: user?.id!, skip: (pageNr - 1) * POST_LIMIT, take: POST_LIMIT },
    { enabled: isEnabled, placeholderData: keepPreviousData }
  )
  const { data: postCount, refetch: refetchCount } = trpc.post.countByUserLikes.useQuery(
    { userId: user?.id! },
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

  if (userError) {
    return <span>User not found.</span>
  }

  const handleNewPage = (newPageNr: number) => {
    setPageNr(newPageNr)
    setIsEnabled(true)
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
                <MinifiedPost
                  post={post}
                  ratingChangeCb={handleRatingChange}
                />
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

export default Liked
