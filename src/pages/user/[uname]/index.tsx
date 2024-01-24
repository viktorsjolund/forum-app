import { MinifiedPost } from '@/components/minifiedPost'
import { PaginationButtons } from '@/components/paginationButtons'
import { ProfileTemplate } from '@/components/profileTemplate'
import { usePageQueryParam } from '@/hooks/usePageQueryParam'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { keepPreviousData } from '@tanstack/react-query'
const POST_LIMIT = 5 as const

const Profile = () => {
  const router = useRouter()
  const { uname } = router.query as { uname: string }

  const [pageNr, setPageNr] = usePageQueryParam()
  const [isEnabled, setIsEnabled] = useState(false)
  const { data: user, error: userError } = trpc.user.byUsername.useQuery({ username: uname })
  const { data: posts, refetch: refetchPosts } = trpc.post.byUser.useQuery(
    { userId: user?.id!, skip: (pageNr - 1) * POST_LIMIT, take: POST_LIMIT },
    { enabled: isEnabled, placeholderData: keepPreviousData }
  )
  const { data: postCount, refetch: refetchCount } = trpc.post.countByUser.useQuery(
    { userId: user?.id! },
    {
      enabled: false
    }
  )
  const { data: me } = trpc.user.me.useQuery()

  useEffect(() => {
    if (user && !postCount && !posts) {
      refetchPosts()
      refetchCount()
    }
  }, [user, refetchPosts, refetchCount, posts, postCount])

  if (userError) {
    return <span>User not found.</span>
  }

  const handleNewPage = (newPageNr: number) => {
    setPageNr(newPageNr)
    setIsEnabled(true)
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
