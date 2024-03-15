import { Header } from '@/components/header'
import { useRouter } from 'next/router'
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react'
import { trpc } from '@/utils/trpc'
import { Loading } from '@/components/loading'
import { getPostTitleSlug } from '@/utils/slug'
import { Avatar } from '@/components/avatar'
import { Comments } from '@/components/post/comments'
import Link from 'next/link'
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineDislike,
  AiOutlineLike,
} from 'react-icons/ai'
import {
  BsBookmarkFill,
  BsBookmark,
  BsBell,
  BsBellFill,
  BsThreeDots,
} from 'react-icons/bs'
import { usePostRating } from '@/hooks/usePostRating'
import { usePostFollow } from '@/hooks/usePostFollow'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { User, post, post_comment, post_reply } from '@prisma/client'
import { StyledButton } from '@/components/styledButton'
import { StyledInput } from '@/components/styledInput'
import { StyledTextarea } from '@/components/styledTextarea'
import { VscLoading } from 'react-icons/vsc'
import moment from 'moment'
import { tokenize } from '@/utils/lexer'

type TEditProps = {
  post: post & { author: User }
  setIsEditing: Dispatch<SetStateAction<boolean>>
  refetchPost: () => Promise<void>
}

const Edit = (props: TEditProps) => {
  const { post, setIsEditing, refetchPost } = props

  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [topic, setTopic] = useState(post.topic || '')
  const [isUpdatingPost, setIsUpdatingPost] = useState(false)
  const updatePostMutation = trpc.post.update.useMutation()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdatingPost(true)

    try {
      await updatePostMutation.mutateAsync({
        postId: post.id,
        content,
        title,
        topic,
      })

      await refetchPost()
      setIsEditing(false)
    } catch (e) {
      setIsUpdatingPost(false)
    }
  }

  return (
    <>
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
                <VscLoading size={20} className='animate-spin' />
              ) : (
                'UPDATE POST'
              )}
            </StyledButton>
          </div>
          <div className='ml-auto'>
            <div onClick={() => setIsEditing(false)}>
              <StyledButton type='button'>CANCEL</StyledButton>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

type TViewProps = {
  post: post & {
    author: User
    comments: (post_comment & {
      author: User
      replies: (post_reply & {
        author: User
      })[]
    })[]
    _count: { dislikes: number; likes: number }
  }
  setIsEditing: Dispatch<SetStateAction<boolean>>
  refetchPost: () => Promise<void>
}

const View = (props: TViewProps) => {
  const { post, refetchPost, setIsEditing } = props
  const router = useRouter()

  const [age, setAge] = useState('')
  const [editedAge, setEditedAge] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const { data: user } = trpc.user.me.useQuery()
  const removePostMutation = trpc.post.remove.useMutation()
  const [handleFollow, isFollowed] = usePostFollow(post.id)
  const [handleLike, handleDislike, isLiked, isDisliked] = usePostRating(
    post.id,
  )
  const { ref, triggerRef } = useOutsideClick<HTMLUListElement, HTMLDivElement>(
    () => setShowOptions(false),
  )

  useEffect(() => {
    if (!age) {
      setAge(moment(post.created_at).fromNow())

      if (post.created_at !== post.updated_at && post.updated_at) {
        setEditedAge(moment(post.updated_at).fromNow())
      }
    }
    if (!scrolled) {
      document
        .querySelector(`#${router.asPath.split('#')[1]}`)
        ?.scrollIntoView()
      setScrolled(true)
    }
  }, [age, scrolled])

  const handleAddBookmark = () => {
    setIsBookmarked(true)
  }

  const handleRemoveBookmark = () => {
    setIsBookmarked(false)
  }

  const handleRemovePost = async () => {
    try {
      await removePostMutation.mutateAsync({
        id: post.id,
      })
      router.push('/?postRemoved=true')
    } catch (e) {
      // TODO: Show popup message
    }
  }

  return (
    <>
      <div className='flex border-b-2 p-8 mb-12 items-center border-b-white border-opacity-50 rounded-sm'>
        <Avatar username={post.author.username!} src={post.author.image} />
        <Link href={`/user/${post.author.username}`}>
          <span className='ml-2 font-bold pr-2 cursor-pointer'>
            {post.author.username}
          </span>
        </Link>
        <span className='text-gray-400 text-xs'>&#8226;</span>
        <span className='pl-2 text-sm text-gray-500'>{age}</span>
        {editedAge && (
          <>
            <span className='pl-2 pr-2 text-gray-500 text-xs'>&#8226;</span>
            <span className='text-sm text-gray-500 italic'>
              edited {editedAge}
            </span>
          </>
        )}
      </div>
      <div className='mb-10 flex'>
        <h1 className='text-4xl break-words w-5/6'>{post.title}</h1>
        <div className='ml-auto h-max relative'>
          <div
            className='cursor-pointer'
            onClick={() => setShowOptions((s) => !s)}
            ref={triggerRef}
          >
            <div className='pointer-events-none'>
              <BsThreeDots size={24} />
            </div>
          </div>
          {showOptions && (
            <ul
              className='absolute bg-gray-900 rounded shadow-black shadow border-[1px] border-slate-800 right-0 font-medium'
              ref={ref}
            >
              {user?.id === post.authorId && (
                <li
                  className='pl-3 pr-3 pb-1 pt-1 text-center whitespace-nowrap cursor-pointer text-sm border-b-[1px] border-slate-800 hover:bg-gray-800'
                  onClick={() => setIsEditing(true)}
                >
                  Edit post
                </li>
              )}
              {(user?.role === 'ADMIN' || user?.id === post.authorId) && (
                <li
                  className='pl-3 pr-3 pb-1 pt-1 text-center whitespace-nowrap cursor-pointer text-sm hover:bg-gray-800'
                  onClick={handleRemovePost}
                >
                  Remove post
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
      <p className='whitespace-pre-wrap w-5/6 break-words'>{post.content}</p>
      <div className='bg-midnight flex mt-20 h-12 rounded'>
        <div className='w-max pl-4 pr-4 pt-2 pb-2 flex items-center'>
          <span>Topics</span>
        </div>
        <div className='flex items-center w-full'>
          {post.topic?.split(',').map((topic, i) => {
            return (
              <Link href={`/topic/${encodeURIComponent(topic)}`} key={i}>
                <div className='bg-main-purple-light rounded-2xl h-max pt-1 pb-1 pr-3 pl-3 shadow-lg cursor-pointer mr-4'>
                  {topic}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <div className='flex h-[6rem] mt-14 w-full'>
        <div className='h-full w-fit min-w-[4.5rem] rounded-tl rounded-bl bg-midnight'>
          <div className='h-2/4 w-full flex justify-center items-center'>
            {isLiked ? (
              <AiFillLike
                size={25}
                onClick={handleLike}
                className='cursor-pointer'
              />
            ) : (
              <AiOutlineLike
                size={25}
                onClick={handleLike}
                className='cursor-pointer'
              />
            )}
          </div>
          <div className='h-2/4 w-full p-4 flex justify-center items-center'>
            <span>{post._count.likes}</span>
          </div>
        </div>
        <div className='h-full min-w-[4.5rem] w-fit rounded-bl bg-midnight'>
          <div className='h-2/4 w-full flex justify-center items-center'>
            {isDisliked ? (
              <AiFillDislike
                size={25}
                onClick={handleDislike}
                className='cursor-pointer'
              />
            ) : (
              <AiOutlineDislike
                size={25}
                onClick={handleDislike}
                className='cursor-pointer'
              />
            )}
          </div>
          <div className='h-2/4 w-full p-4 flex justify-center items-center'>
            <span>{post._count.dislikes}</span>
          </div>
        </div>
        <div className='h-full w-[4.5rem]'>
          <div className='h-2/4 w-full flex justify-center items-center bg-midnight'>
            {isBookmarked ? (
              <BsBookmarkFill
                size={25}
                onClick={handleRemoveBookmark}
                className='cursor-pointer'
              />
            ) : (
              <BsBookmark
                size={25}
                onClick={handleAddBookmark}
                className='cursor-pointer'
              />
            )}
          </div>
        </div>
        <div className='h-full w-[4.5rem]'>
          <div className='h-2/4 w-full flex justify-center items-center bg-midnight'>
            {isFollowed ? (
              <BsBellFill
                size={25}
                onClick={handleFollow}
                className='cursor-pointer'
              />
            ) : (
              <BsBell
                size={25}
                onClick={handleFollow}
                className='cursor-pointer'
              />
            )}
          </div>
        </div>
        <div className='h-full w-full rounded-tr rounded-bl'>
          <div className='h-2/4 min-w-[4.5rem] flex justify-center items-center bg-midnight rounded-tr rounded-bl'></div>
        </div>
      </div>
      <Comments
        comments={post.comments}
        postId={post.id}
        refetchPost={refetchPost}
      />
    </>
  )
}

export const Post = () => {
  const router = useRouter()
  const { slug } = router.query as { slug: string[] }
  const pid = slug[0]

  const [isEditing, setIsEditing] = useState(false)
  const { data: post, refetch } = trpc.post.byId.useQuery({ id: pid })

  const refetchPost = async () => {
    await refetch()
  }

  useEffect(() => {
    if (post) {
      router.push(
        `/view-post/${post.id}/${getPostTitleSlug(post.title)}`,
        undefined,
        {
          shallow: true,
        },
      )
    }
  }, [post])

  if (!post) {
    return <Loading />
  }

  return (
    <>
      <Header />
      <div className='flex justify-center h-max min-h-full bg-gradient-to-tr from-main-purple-light to-main-purple via-main-purple-dark'>
        <div className='w-4/5 bg-[#212529] p-20 min-h-full pb-[100vh]'>
          {isEditing ? (
            <Edit
              post={post}
              refetchPost={refetchPost}
              setIsEditing={setIsEditing}
            />
          ) : (
            <View
              post={post}
              refetchPost={refetchPost}
              setIsEditing={setIsEditing}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default Post
