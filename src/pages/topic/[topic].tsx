import { Header } from '@/components/header'
import { Loading } from '@/components/loading'
import { trpc } from '@/utils/trpc'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'

const PostTopic = () => {
  const router = useRouter()
  const { topic } = router.query as { topic: string }
  const { data: posts, isLoading } = trpc.post.byTopic.useQuery({ topic })

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <Header />
      {posts?.map((post) => {
        return (
          <Link href={`/view-post/${post.id}`} key={post.id}>
            <div className='w-full bg-midnight-light flex flex-col cursor-pointer'>
              <span>{post.title}</span>
              <span>{post.author.username}</span>
              <span>{moment(post.created_at).fromNow()}</span>
            </div>
          </Link>
        )
      })}
    </>
  )
}

export default PostTopic
