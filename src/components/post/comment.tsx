import { Avatar, Box, Button, FormControl, TextField, Typography } from '@mui/material'
import type { post_comment, user, post_reply } from '@prisma/client'
import Link from 'next/link'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { Replies } from './replies'
import { trpc } from '@/utils/trpc'
import { grey400 } from '@/utils/colors'
import { getDateAge } from '@/utils/timeCalculator'
import autoAnimate from '@formkit/auto-animate'
import { UserCard } from './userCard'

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
        {showReplies && <Replies replies={comment.replies} />}
      </Box>
    </Box>
  )
}
