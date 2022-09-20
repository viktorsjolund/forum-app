import { trpc } from '@/utils/trpc'
import { Button } from '@mui/material'
import Link from 'next/link'

const Home = () => {
  const posts = trpc.useQuery(['post.all'])
  if (!posts.data) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {posts.data.map((post) => {
        return (
          <Link href={`/view-post/${post.id}`} key={post.id}>
            <a>
              <Button style={{
                width: '500px',
                height: '100px',
              }}
              variant='contained' color='secondary'>
                {post.title}
                {post.id}
              </Button>
            </a>
          </Link>
        )
      })}
    </div>
  )
}

export default Home
