import Header from '@/components/header'
import { trpc } from '@/utils/trpc'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'

const Profile = () => {
  const router = useRouter()
  const user = trpc.useQuery(['user.me'])

  if (user.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Header />
      <Box>
        <Typography>
          {user.data?.username}
        </Typography>
        <Typography>
          {user.data?.email}
        </Typography>
      </Box>
    </>
  )
}

export default Profile
