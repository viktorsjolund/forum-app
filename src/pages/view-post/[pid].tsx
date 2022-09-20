import Header from '@/components/header'
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
    <div>
      <Header />
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
        {post.data.content}
      </Typography>
      <Typography color='white'>
        {post.data.created_at.toString()}
      </Typography>
      <Typography color='white'>
        {post.data.updated_at.toString()}
      </Typography>
      <Typography color='white'>
        {post.data.author.username}
      </Typography>
    </div>
  )
}

export default Post
