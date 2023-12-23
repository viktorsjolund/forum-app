import { Header } from '@/components/header'
import { Loading } from '@/components/loading'
import { trpc } from '@/utils/trpc'
import Link from 'next/link'

const Trending = () => {
  const posts = trpc.useQuery(['post.all'])
  if (!posts.data) {
    return <Loading />
  }

  return (
    <>
      <Header />
      <div className='p-5 cursor-pointer'>
        {posts.data.map((post) => {
          return (
            <Link
              href={`/view-post/${post.id}`}
              key={post.id}
              passHref
            >
              <div className='h-20 bg-black mb-10'>
                {post.title}
                {post.id}
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default Trending
