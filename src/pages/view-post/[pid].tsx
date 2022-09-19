import { trpc } from '@/utils/trpc'
import { Typography } from '@mui/material'
import { useRouter } from 'next/router'

const Post = () => {
  const router = useRouter()
  const { pid } = router.query
  if (!pid) return

  const post = trpc.useQuery(['post.byId', { id: Array.isArray(pid) ? parseInt(pid[0]) : parseInt(pid) }])
  if (!post.data) {
    return <div>Loading...</div>
  }

  return (
    <div className='p-10'>
      <Typography 
        variant='h2' 
        component='h1' 
        color='white'
        gutterBottom>
        {post.data.title}
      </Typography>
      <Typography 
        color='white'
        paragraph
        width='60%'
        >
        {post.data.description}
      </Typography>
      <Typography color='white'>
        Post id: {post.data.id}
      </Typography>
    </div>
  )
}

export default Post
