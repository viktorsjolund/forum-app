import { Box } from '@mui/material'
import type { post_reply, user } from '@prisma/client'
import { UserCard } from './userCard'

type TReplyProps = {
  reply: post_reply & {
    author: user
  }
  refetchPost: () => Promise<void>
}

export const Reply = (props: TReplyProps) => {
  const { reply, refetchPost } = props

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
        refetchPost={refetchPost}
      />
    </Box>
  )
}
