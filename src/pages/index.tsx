import { trpc } from '@/utils/trpc'

const Home = () => {
  const post = trpc.useQuery(['post.byId', { id: '1' }])
  if (!post.data) {
    return <div>Loading...</div>
  }

  return <div>{post.data}</div>
}

export default Home
