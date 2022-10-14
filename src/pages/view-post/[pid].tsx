import {Header} from '@/components/header'
import { trpc } from '@/utils/trpc'
import { Box, IconButton, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { Avatar } from '@/components/avatar'
import {
  ThumbUpOffAlt,
  ThumbUpAlt,
  ThumbDownOffAlt,
  ThumbDownAlt,
  BookmarkBorder,
  Bookmark,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { Comments } from '@/components/post/comments'
import { GREY400, GREY500, GREY600, GREY700, GREY800, GREY900 } from '@/utils/colors'
import Link from 'next/link'
import { getDateAge } from '@/utils/timeCalculator'
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from 'react-icons/ai'
import { BsBookmarkFill, BsBookmark, BsBell, BsBellSlash, BsBellFill } from 'react-icons/bs'

const Post = () => {
  const router = useRouter()
  const { pid } = router.query
  const postId = Array.isArray(pid) ? parseInt(pid[0]) : parseInt(pid!)

  const [age, setAge] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isNotificationsOn, setIsNotificationsOn] = useState(false)

  const {
    data: isLikedData,
    isLoading: isLikedLoading,
    error: isLikedError,
  } = trpc.useQuery(['like.userHasLikedPost', { postId }])
  const {
    data: isDislikedData,
    isLoading: isDislikedLoading,
    error: isDislikedError,
  } = trpc.useQuery(['dislike.userHasDislikedPost', { postId }])
  const { data: post, refetch } = trpc.useQuery(['post.byId', { id: postId }])

  useEffect(() => {
    if (!isLikedLoading && !isDislikedLoading) {
      setIsLiked(isLikedData!)
      setIsDisliked(isDislikedData!)
    }
    if (post) {
      if (!age) {
        setAge(getDateAge(post.created_at.toString()))
      }
      setLikes(post.likes.length)
      setDislikes(post.dislikes.length)
    }
  }, [
    isLikedData,
    isDislikedData,
    isLikedLoading,
    isDislikedLoading,
    isDislikedError,
    isLikedError,
    router,
    post,
    age,
  ])

  const addLike = trpc.useMutation(['like.add'])
  const removeLike = trpc.useMutation(['like.remove'])
  const addDislike = trpc.useMutation(['dislike.add'])
  const removeDislike = trpc.useMutation(['dislike.remove'])

  if (!post) {
    return <div>Loading...</div>
  }

  const handleAddLike = async () => {
    setLikes(likes + 1)
    if (isDisliked) {
      setDislikes(dislikes - 1)
    }
    setIsDisliked(false)
    setIsLiked(true)
    await removeDislike.mutateAsync({
      postId,
    })
    await addLike.mutateAsync({
      postId,
    })
  }

  const handleAddDislike = async () => {
    setDislikes(dislikes + 1)
    if (isLiked) {
      setLikes(likes - 1)
    }
    setIsDisliked(true)
    setIsLiked(false)
    await removeLike.mutateAsync({
      postId,
    })
    await addDislike.mutateAsync({
      postId,
    })
  }

  const handleRemoveDislike = async () => {
    setDislikes(dislikes - 1)
    setIsDisliked(false)
    await removeDislike.mutateAsync({
      postId,
    })
  }

  const handleRemoveLike = async () => {
    setLikes(likes - 1)
    setIsLiked(false)
    await removeLike.mutateAsync({
      postId,
    })
  }

  const handleAddBookmark = () => {
    setIsBookmarked(true)
  }

  const handleRemoveBookmark = () => {
    setIsBookmarked(false)
  }

  const handleEnableNotifications = () => {
    setIsNotificationsOn(true)
  }

  const handleDisableNotifications = () => {
    setIsNotificationsOn(false)
  }

  const refetchPost = async () => {
    await refetch()
  }

  return (
    <>
      <Header />
      <div className='flex justify-center h-max'>
        <div className='w-4/5 bg-[#212529] p-20 h-full'>
          <div className='flex border-b-2 p-8 mb-12 items-center border-b-white border-opacity-50 rounded-sm'>
            <Avatar username={post.author.username} />
            <Link href={`/account/${post.author.username}`}>
              <span className='ml-2 font-bold pr-2 cursor-pointer'>{post.author.username}</span>
            </Link>
            <span className='text-[#9a9a9a]'>&#8226;</span>
            <span className='pl-2 text-sm text-gray-500'>{age}</span>
          </div>
          <h1 className='mb-10 text-4xl'>{post.title}</h1>
          <p className='whitespace-pre-wrap w-3/5'>{post.content}</p>
          <div className='flex h-[6rem] mt-20 w-full'>
            <div className='h-full w-max rounded-tl rounded-bl bg-midnight'>
              <div className='h-2/4 min-w-[4.5rem] flex justify-center items-center'>
                {isLiked ? (
                  <AiFillLike
                    size={25}
                    onClick={handleRemoveLike}
                    className='cursor-pointer'
                  />
                ) : (
                  <AiOutlineLike
                    size={25}
                    onClick={handleAddLike}
                    className='cursor-pointer'
                  />
                )}
              </div>
              <div className='h-2/4 p-4 flex justify-center items-center'>
                <span>{likes}</span>
              </div>
            </div>
            <div className='h-full w-max rounded-bl bg-midnight'>
              <div className='h-2/4 min-w-[4.5rem] flex justify-center items-center'>
                {isDisliked ? (
                  <AiFillDislike
                    size={25}
                    onClick={handleRemoveDislike}
                    className='cursor-pointer'
                  />
                ) : (
                  <AiOutlineDislike
                    size={25}
                    onClick={handleAddDislike}
                    className='cursor-pointer'
                  />
                )}
              </div>
              <div className='h-2/4 p-4 flex justify-center items-center'>
                <span>{dislikes}</span>
              </div>
            </div>
            <div className='h-full w-max'>
              <div className='h-2/4 min-w-[4.5rem] flex justify-center items-center bg-midnight'>
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
            <div className='h-full w-max'>
              <div className='h-2/4 min-w-[4.5rem] flex justify-center items-center bg-midnight'>
                {isNotificationsOn ? (
                  <BsBellFill
                    size={25}
                    onClick={handleDisableNotifications}
                    className='cursor-pointer'
                  />
                ) : (
                  <BsBell
                    size={25}
                    onClick={handleEnableNotifications}
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
        </div>
      </div>
    </>
  )
}

export default Post
