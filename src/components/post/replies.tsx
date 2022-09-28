import { Box } from '@mui/material'
import type { post_reply, user } from '@prisma/client'
import { Reply } from './reply'

type TRepliesProps = {
  replies: (post_reply & {
    author: user
  })[]
  refetchPost: () => Promise<void>
}

export const Replies = (props: TRepliesProps) => {
  const { replies, refetchPost } = props

  return (
    <Box>
      {replies.map((reply) => {
        return (
          <Reply
            reply={reply}
            key={reply.id}
            refetchPost={refetchPost}
          />
        )
      })}
    </Box>
  )
}
