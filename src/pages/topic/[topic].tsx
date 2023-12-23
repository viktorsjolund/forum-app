import { Header } from '@/components/header'
import { Loading } from '@/components/loading'
import { getDateAge } from '@/utils/timeCalculator'
import { trpc } from '@/utils/trpc'
import Link from 'next/link'
import { useRouter } from 'next/router'

const PostTopic = () => {
  const router = useRouter()
  const { topic } = router.query as { topic: string }
  const { data: posts, isLoading } = trpc.useQuery(['post.byTopic', { topic }])

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <Header />
      {posts?.map((post) => {
        return (
          <Link
            href={`/view-post/${post.id}`}
            key={post.id}
            passHref
          >
            <div className='w-full bg-midnight-light flex flex-col cursor-pointer'>
              <span>{post.title}</span>
              <span>{post.author.username}</span>
              <span>{getDateAge(post.created_at.toString())}</span>
            </div>
          </Link>
        )
      })}
    </>
  )
}

export default PostTopic
