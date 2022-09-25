import Header from '@/components/header'
import { trpc } from '@/utils/trpc'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { ThumbUpOffAlt, ThumbDownOffAlt } from '@mui/icons-material'

const Post = () => {
  const router = useRouter()
  const { pid } = router.query
  if (!pid) return

  const pidParsed = Array.isArray(pid) ? parseInt(pid[0]) : parseInt(pid)

  const likes = trpc.useQuery(['like.totalCountByPostId', { postId: pidParsed }])
  const dislikes = trpc.useQuery(['dislike.totalCountByPostId', { postId: pidParsed }])
  const post = trpc.useQuery(['post.byId', { id: pidParsed }])

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
      <Box display='flex' sx={{ svg: { cursor: 'pointer' }}}>
        <Box display='flex'>
          <Typography> 
            {likes.data}
          </Typography>
          <ThumbUpOffAlt />
        </Box>
        <Box display='flex'>
          <ThumbDownOffAlt />
          <Typography> 
            {dislikes.data}
          </Typography>
        </Box>
      </Box>
    </div>
  )
}

export default Post
