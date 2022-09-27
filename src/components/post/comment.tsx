import { Box, Button, FormControl, TextField, Typography } from '@mui/material'
import type { post_comment, user, post_reply } from '@prisma/client'
import Link from 'next/link'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { FormEvent, useState } from 'react'
import { Replies } from './replies'
import { purple } from '@mui/material/colors'
import { trpc } from '@/utils/trpc'

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
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [content, setContent] = useState('')
  const addReply = trpc.useMutation(['reply.add'])

  const toggleReplies = () => {
    setShowReplies(!showReplies)
  }

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowReplyForm(false)

    await addReply.mutateAsync({
      commentId: comment.id,
      content
    })
  }

  return (
    <Box bgcolor={purple[900]}>
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
      <Typography
        sx={{ cursor: 'pointer' }}
        onClick={toggleReplyForm}
      >
        Reply
      </Typography>
      {showReplyForm && (
        <FormControl
          component='form'
          onSubmit={handleSubmit}
        >
          <TextField
            required
            label='Make a reply'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            type='submit'
            variant='contained'
          >
            Reply
          </Button>
        </FormControl>
      )}
      <Box>
        {comment.replies.length > 0 && (
          <Typography
            sx={{ cursor: 'pointer' }}
            onClick={toggleReplies}
          >
            {showReplies ? <ArrowDropUp /> : <ArrowDropDown />}
            {comment.replies.length} replies
          </Typography>
        )}
        {showReplies && <Replies replies={comment.replies} />}
      </Box>
    </Box>
  )
}
