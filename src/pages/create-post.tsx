import Header from '@/components/header'
import { trpc } from '@/utils/trpc'
import { Box, Button, FormControl, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'

const CreatePost = () => {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('')
  const addPost = trpc.useMutation(['post.add'])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const result = await addPost.mutateAsync({
        content,
        title,
        topic
      })

      router.push(`/view-post/${result.id}`)
    } catch (e) {
      throw e
    }
  }

  return (
    <>
      <Header />
      <Box sx={{ p: 10 }}>
        <FormControl component='form' fullWidth onSubmit={handleSubmit}>      
          <TextField
            required
            variant='filled'
            label='Title'
            sx={{ label: { color: 'white' }, width: '400px'}}
            color='secondary'
            margin='normal'
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <TextField
            required
            variant='filled'
            label='Content'
            sx={{ label: { color: 'white' }}}
            color='secondary'
            multiline={true}
            rows={8}
            margin='normal'
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <TextField
            required
            variant='filled'
            label='Topic'
            sx={{ label: { color: 'white' }, width: '400px'}}
            color='secondary'
            margin='normal'
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
          <Button type='submit' variant='contained' sx={{ width: '300px'}}>
            Create Post
          </Button>
        </FormControl>
      </Box>
    </>
  )
}

export default CreatePost
