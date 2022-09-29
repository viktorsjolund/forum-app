import Header from '@/components/header'
import { Box, Typography } from '@mui/material'
import Link from 'next/link'

const Home = () => {
  return (
    <>
      <Header />
      <Box display='flex'>
        <Link href='/trending' passHref>
          <Box sx={{ cursor: 'pointer' }}>
            <Typography>
              Trending
            </Typography>
          </Box>
        </Link>
      </Box>
    </>
  )
}

export default Home
