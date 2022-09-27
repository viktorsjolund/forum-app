import { Box } from '@mui/material'
import type { post_reply, user } from '@prisma/client'
import { Reply } from './reply'

type TRepliesProps = {
  replies: (post_reply & {
    author: user
  })[]
}

export const Replies = (props: TRepliesProps) => {
  const { replies } = props

  return (
    <Box>
      {replies.map((reply) => {
        return (
          <Reply
            reply={reply}
            key={reply.id}
          />
        )
      })}
    </Box>
  )
}
