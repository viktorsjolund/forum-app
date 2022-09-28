import { Box } from '@mui/material'
import type { post_comment, user, post_reply } from '@prisma/client'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { useEffect, useRef, useState } from 'react'
import { Replies } from './replies'
import autoAnimate from '@formkit/auto-animate'
import { UserCard } from './userCard'

type TCommentProps = {
  comment: post_comment & {
    author: user
    replies: (post_reply & {
      author: user
    })[]
  }
  refetchPost: () => Promise<void>
}

export const Comment = (props: TCommentProps) => {
  const { comment, refetchPost } = props
  const [showReplies, setShowReplies] = useState(false)
  const repliesDropdownRef = useRef(null)

  const toggleReplies = () => {
    setShowReplies(!showReplies)
  }

  useEffect(() => {
    repliesDropdownRef.current && autoAnimate(repliesDropdownRef.current)
  }, [])

  return (
    <Box mb={4}>
      <UserCard
        content={comment.content}
        createdAt={comment.created_at}
        updatedAt={comment.updated_at}
        username={comment.author.username}
        commentId={comment.id}
        refetchPost={refetchPost}
      />
      <Box
        m={1}
        ref={repliesDropdownRef}
      >
        {comment.replies.length > 0 && (
          <Box
            sx={{ cursor: 'pointer', width: 'max-content' }}
            onClick={toggleReplies}
            alignContent='center'
            justifyContent='center'
            display='flex'
            color='blueviolet'
          >
            {showReplies ? (
              <ArrowDropUp sx={{ fill: 'blueviolet' }} />
            ) : (
              <ArrowDropDown sx={{ fill: 'blueviolet' }} />
            )}
            {comment.replies.length} replies
          </Box>
        )}
        {showReplies && (
          <Replies
            replies={comment.replies}
            refetchPost={refetchPost}
          />
        )}
      </Box>
    </Box>
  )
}
