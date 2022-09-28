import { trpc } from '@/utils/trpc'
import { Box, Button, CircularProgress, FormControl, TextField } from '@mui/material'
import type { post_comment, user, post_reply } from '@prisma/client'
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Comment } from './comment'
import autoAnimate from '@formkit/auto-animate'

type TCommentsProps = {
  comments: (post_comment & {
    author: user
    replies: (post_reply & {
      author: user
    })[]
  })[]
  postId: number
  refetchPost: () => Promise<void>
}

export const Comments = (props: TCommentsProps) => {
  const { comments, postId, refetchPost } = props
  const [content, setContent] = useState('')
  const [isRefetching, setIsRefetching] = useState(false)
  const addComment = trpc.useMutation(['comments.add'])
  const commentsRef = useRef(null)
  const commentsReversed = useMemo(() => [...comments].reverse(), [comments])

  useEffect(() => {
    commentsRef.current && autoAnimate(commentsRef.current)
  }, [commentsRef])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setContent('')

    await addComment.mutateAsync({
      content,
      postId,
    })
    setIsRefetching(true)
    await refetchPost()
    setIsRefetching(false)
  }

  return (
    <Box ref={commentsRef}>
      <FormControl
        component='form'
        onSubmit={handleSubmit}
        fullWidth
      >
        <Box width='100%'>
          <TextField
            multiline
            required
            variant='filled'
            label='Make a comment'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            color='secondary'
            sx={{ label: { color: 'white' } }}
            fullWidth
            size='small'
          />
          <Button
            type='submit'
            variant='contained'
            color='secondary'
            sx={{ minHeight: '38px', width: '7%', pr: 3, pl: 3, float: 'right', m: 2 }}
          >
            {isRefetching ? <CircularProgress size='1rem' /> : 'Comment'}
          </Button>
        </Box>
      </FormControl>
      {commentsReversed.map((comment) => {
        return (
          <Comment
            comment={comment}
            key={comment.id}
            refetchPost={refetchPost}
          />
        )
      })}
    </Box>
  )
}
