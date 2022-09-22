import Header from '@/components/header'
import { trpc } from '@/utils/trpc'
import { Box, Button } from '@mui/material'
import Link from 'next/link'

const Trending = () => {
  const posts = trpc.useQuery(['post.all'])
  if (!posts.data) {
    return <div>Loading...</div>
  }

  return (
    <Box>
      <Header />
      <Box sx={{ p: 3 }}>
      {posts.data.map((post) => {
        return (
          <Link
            href={`/view-post/${post.id}`}
            key={post.id}
            passHref
          >
            <Button 
              sx={{
                height: '100px',
                bgcolor: '#240046',
                color: 'white',
                mb: 5
              }}
              variant='contained'
              color='primary'
              fullWidth
            >
              {post.title}
              {post.id}
            </Button>
          </Link>
        )
      })}
      </Box>
    </Box>
  )
}

export default Trending
