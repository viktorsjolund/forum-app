import { Header } from '@/components/header'
import { trpc } from '@/utils/trpc'
import Link from 'next/link'

const Trending = () => {
  const posts = trpc.useQuery(['post.all'])
  if (!posts.data) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Header />
      <div className='p-5'>
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
