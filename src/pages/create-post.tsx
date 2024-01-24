import { Header } from '@/components/header'
import { PopupMessage } from '@/components/popupMessage'
import { StyledButton } from '@/components/styledButton'
import { StyledInput } from '@/components/styledInput'
import { StyledTextarea } from '@/components/styledTextarea'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { VscLoading } from 'react-icons/vsc'
import { faker } from '@faker-js/faker'

const CreatePost = () => {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const addPost = trpc.post.add.useMutation()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsCreatingPost(true)

    try {
      const result = await addPost.mutateAsync({
        content,
        title,
        topic
      })

      router.push(`/view-post/${result.id}`)
    } catch (e) {
      setErrorMessage('Something went wrong when trying to create the post. Please try again.')
      setIsCreatingPost(false)
      setShowPopup(true)
    }
  }

  const generateFakePosts = async () => {
    for (const _ of new Array(50).fill(1)) {
      await new Promise((resolve) => {
        setTimeout(() => {
          addPost.mutate({
            content: faker.lorem.paragraphs({ min: 3, max: 10 }),
            title: faker.lorem.sentence(),
            topic: faker.lorem.words({ min: 0, max: 5 }).split(' ').join(',')
          })
          resolve(null)
        }, 100)
      })
    }
  }

  return (
    <>
      <Header />
      <div className='flex justify-center h-max min-h-full bg-gradient-to-tr from-main-purple-light to-main-purple via-main-purple-dark'>
        <div className='w-4/5 bg-[#212529] p-20 min-h-full'>
          <h1 className='text-3xl'>Create a post</h1>
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
            <div className='w-fit h-8'>
              <StyledButton type='submit'>
                {isCreatingPost ? (
                  <VscLoading
                    size={20}
                    className='animate-spin'
                  />
                ) : (
                  'CREATE POST'
                )}
              </StyledButton>
            </div>
          </form>
          <button onClick={generateFakePosts}>Generate fake posts</button>
        </div>
      </div>
      {errorMessage && (
        <PopupMessage
          message={errorMessage}
          show={showPopup}
        />
      )}
    </>
  )
}

export default CreatePost
