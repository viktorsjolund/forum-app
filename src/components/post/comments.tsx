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
      postId,
    })
  }

  return (
    <Box>
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
            sx={{ height: '100%', width: 'max-content', pr: 3, pl: 3, float: 'right', m: 2}}
          >
            Comment
          </Button>
        </Box>
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
