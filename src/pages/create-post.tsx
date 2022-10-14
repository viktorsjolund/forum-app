import { Header } from '@/components/header'
import { trpc } from '@/utils/trpc'
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
        topic,
      })

      router.push(`/view-post/${result.id}`)
    } catch (e) {
      throw e
    }
  }

  return (
    <>
      <Header />
      <div className='p-10'>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <label>Topic</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button type='submit'>Create post</button>
        </form>
      </div>
    </>
  )
}

export default CreatePost
