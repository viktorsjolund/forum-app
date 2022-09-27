import { Box, Typography } from '@mui/material'
import type { post_reply, user } from '@prisma/client'
import Link from 'next/link'

type TReplyProps = {
  reply: post_reply & {
    author: user
  }
}

export const Reply = (props: TReplyProps) => {
  const { reply } = props

  return (
    <Box>
      <Box>
        <Link
          href={`/account/${reply.author.username}`}
          passHref
        >
          <Typography sx={{ cursor: 'pointer' }}>{reply.author.username}</Typography>
        </Link>
      </Box>
      <Box>
        <Typography>{reply.content}</Typography>
      </Box>
    </Box>
  )
}
