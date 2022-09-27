import { trpc } from '@/utils/trpc'
import { Box, Button, FormControl, TextField } from '@mui/material'
import type { post_comment, user, post_reply } from '@prisma/client'
import { FormEvent, useState } from 'react'
import { Comment } from './comment'

type TCommentsProps = {
  comments: (post_comment & {
    author: user
    replies: (post_reply & {
      author: user
    })[]
  })[]
  postId: number
}

export const Comments = (props: TCommentsProps) => {
  const { comments, postId } = props
  const [content, setContent] = useState('')
  const addComment = trpc.useMutation(['comments.add'])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setContent('')

    await addComment.mutateAsync({
      content,
      postId
    })
  }

  return (
    <Box>
      <FormControl
        component='form'
        onSubmit={handleSubmit}
      >
        <TextField
          multiline
          rows={3}
          required
          variant='filled'
          label='Make a comment'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          type='submit'
          variant='contained'
        >
          Post
        </Button>
      </FormControl>
      {comments.map((comment) => {
        return (
          <Comment
            comment={comment}
            key={comment.id}
          />
        )
      })}
    </Box>
  )
}
