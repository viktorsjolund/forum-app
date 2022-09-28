import { grey400 } from '@/utils/colors'
import { getDateAge } from '@/utils/timeCalculator'
import { Avatar, Box, Button, CircularProgress, FormControl, TextField, Typography } from '@mui/material'
import Link from 'next/link'
import { FormEvent, useEffect, useRef, useState } from 'react'
import autoAnimate from '@formkit/auto-animate'
import { trpc } from '@/utils/trpc'

type TUserCardProps = {
  username: string
  createdAt: Date
  updatedAt: Date
  content: string
  commentId: number
  refetchPost: () => Promise<void>
}

export const UserCard = (props: TUserCardProps) => {
  const { username, createdAt, updatedAt, content, commentId, refetchPost } = props
  const [age, setAge] = useState('')
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyFormContent, setReplyFormContent] = useState(`@${username}, `)
  const [isRefetching, setIsRefetching] = useState(false)
  const replyFormRef = useRef(null)
  const addReply = trpc.useMutation(['reply.add'])

  useEffect(() => {
    if (!age) {
      setAge(getDateAge(createdAt.toString()))
    }

    replyFormRef.current && autoAnimate(replyFormRef.current, {
      duration: 200,
    })
  }, [createdAt, age])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setReplyFormContent('')

    await addReply.mutateAsync({
      commentId,
      content: replyFormContent,
    })

    setIsRefetching(true)
    await refetchPost()
    setIsRefetching(false)
  }

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm)
  }

  return (
    <Box>
      <Box
        display='flex'
        alignItems='center'
      >
        <Avatar
          src='/images/avatar.png'
          sx={{ position: 'absolute', ml: -5 }}
        />
        <Link
          href={`/account/${username}`}
          passHref
        >
          <Typography
            borderRight={1}
            sx={{ cursor: 'pointer', width: 'max-content', pr: 1, fontWeight: 'bold', pl: 1 }}
          >
            {username}
          </Typography>
        </Link>
        <Typography
          ml={1}
          fontSize={12}
          color='secondary'
        >
          {age}
        </Typography>
      </Box>
      <Box m={1}>
        <Typography sx={{ p: { whiteSpace: 'pre-line' } }}>{content}</Typography>
      </Box>
      <Typography
        sx={{ cursor: 'pointer', width: 'max-content' }}
        onClick={toggleReplyForm}
        color={grey400}
      >
        Reply
      </Typography>
      <Box ref={replyFormRef}>
        {showReplyForm && (
          <FormControl
            component='form'
            onSubmit={handleSubmit}
            fullWidth
          >
            <Box width='100%'>
              <TextField
                required
                multiline
                label='Make a reply'
                value={replyFormContent}
                variant='filled'
                onChange={(e) => setReplyFormContent(e.target.value)}
                color='secondary'
                sx={{ label: { color: 'white' }, mt: 2 }}
                fullWidth
                size='small'
              />
              <Button
                type='submit'
                variant='contained'
                color='secondary'
                sx={{ minHeight: '38px', width: '5%', pr: 3, pl: 3, float: 'right', m: 2 }}
              >
                {isRefetching ? <CircularProgress size='1rem' /> : 'Reply'}
              </Button>
            </Box>
          </FormControl>
        )}
      </Box>
    </Box>
  )
}
