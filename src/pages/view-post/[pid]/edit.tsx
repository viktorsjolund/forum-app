import { Header } from '@/components/header'
import { Loading } from '@/components/loading'
import { StyledButton } from '@/components/styledButton'
import { StyledInput } from '@/components/styledInput'
import { StyledTextarea } from '@/components/styledTextarea'
import { trpc } from '@/utils/trpc'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import { VscLoading } from 'react-icons/vsc'

const Edit = () => {
  const router = useRouter()
  const { pid } = router.query as { pid: string }
  const postId = parseInt(pid)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [topic, setTopic] = useState('')
  const [isUpdatingPost, setIsUpdatingPost] = useState(false)
  const { data: isAuthor } = trpc.useQuery(['post.isAuthor', { postId }])
  const { data: post, isLoading } = trpc.useQuery(['post.byId', { id: postId }])
  const updatePostMutation = trpc.useMutation(['post.update'])

  useEffect(() => {
    if (typeof isAuthor !== 'undefined' && !isAuthor) {
      router.push(`/view-post/${postId}`)
    }

    if (post) {
      setTitle(post.title)
      setContent(post.content)
      setTopic(post.topic || '')
    }
  }, [isAuthor, router, postId, post])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdatingPost(true)

    try {
      await updatePostMutation.mutateAsync({
        postId,
        content,
        title,
        topic
      })

      router.push(`/view-post/${postId}`)
    } catch (e) {
      setIsUpdatingPost(false)
    }
  }

  if (!isAuthor || isLoading) {
    ;<Loading />
  }

  return (
    <>
      <Header />
      <div className='flex justify-center h-max min-h-full bg-gradient-to-tr from-main-purple-light to-main-purple via-main-purple-dark'>
        <div className='w-4/5 bg-[#212529] p-20 min-h-full'>
          <h1 className='text-3xl'>Edit post</h1>
          <form
            onSubmit={handleSubmit}
            className='w-full flex flex-col mt-10 font-medium'
          >
            <div className='mb-5 w-1/3'>
              <StyledInput
                elementId='title'
                label='Title *'
                onChange={(e) => setTitle(e.target.value.trimStart())}
                required={true}
                value={title}
                placeholder='Enter title'
                maxLength={255}
              />
            </div>
            <div className='mb-5 w-1/3'>
              <StyledInput
                elementId='topic'
                label='Topics'
                onChange={(e) => setTopic(e.target.value)}
                required={false}
                value={topic}
                pattern='^[A-Za-z,]+$'
                placeholder='E.g. news,fruits,planets'
                maxLength={255}
              />
            </div>
            <div className='mb-5'>
              <StyledTextarea
                elementId='content'
                label='Content *'
                onChange={(e) => setContent(e.target.value.trimStart())}
                required={true}
                value={content}
                placeholder='Enter content'
                maxLength={4000}
                maxRows={50}
              />
            </div>
            <div className='flex'>
              <div className='w-fit h-8'>
                <StyledButton type='submit'>
                  {isUpdatingPost ? (
                    <VscLoading
                      size={20}
                      className='animate-spin'
                    />
                  ) : (
                    'UPDATE POST'
                  )}
                </StyledButton>
              </div>
              <div className='ml-auto'>
                <Link
                  href={`/view-post/${postId}`}
                  passHref
                >
                  <div>
                    <StyledButton type='button'>CANCEL</StyledButton>
                  </div>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Edit
