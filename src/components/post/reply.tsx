import { Box, Typography } from '@mui/material'
import type { post_reply, user } from '@prisma/client'
import Link from 'next/link'
import { UserCard } from './userCard'

type TReplyProps = {
  reply: post_reply & {
    author: user
  }
}

export const Reply = (props: TReplyProps) => {
  const { reply } = props

  return (
    <Box
      ml={4}
      mt={2}
    >
      <UserCard
        content={reply.content}
        createdAt={reply.created_at}
        updatedAt={reply.updated_at}
        username={reply.author.username}
        commentId={reply.comment_id}
      />
    </Box>
  )
}
