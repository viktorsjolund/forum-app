import { Box, Typography } from '@mui/material'
import type { post_comment, user, post_reply } from '@prisma/client'
import Link from 'next/link'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { useState } from 'react'
import { Replies } from './replies'

type TCommentProps = {
  comment: post_comment & {
    author: user
    replies: (post_reply & {
      author: user
    })[]
  }
}

export const Comment = (props: TCommentProps) => {
  const { comment } = props
  const [showReplies, setShowReplies] = useState(false)

  const toggleReplies = () => {
    setShowReplies(!showReplies)
  }

  return (
    <Box>
      <Box>
        <Link
          href={`/account/${comment.author.username}`}
          passHref
        >
          <Typography sx={{ cursor: 'pointer' }}>{comment.author.username}</Typography>
        </Link>
      </Box>
      <Box>
        <Typography>{comment.content}</Typography>
      </Box>
      <Box>
        {comment.replies.length > 0 ?? (
          <Typography
            sx={{ cursor: 'pointer' }}
            onClick={toggleReplies}
          >
            {showReplies ? <ArrowDropUp /> : <ArrowDropDown />}
            {comment.replies.length} replies
          </Typography>
        )}
        {showReplies ?? <Replies replies={comment.replies} />}
      </Box>
    </Box>
  )
}
