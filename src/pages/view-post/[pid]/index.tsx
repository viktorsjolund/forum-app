import { Header } from '@/components/header'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { Avatar } from '@/components/avatar'
import { useEffect, useState } from 'react'
import { Comments } from '@/components/post/comments'
import Link from 'next/link'
import { getDateAge } from '@/utils/timeCalculator'
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from 'react-icons/ai'
import { BsBookmarkFill, BsBookmark, BsBell, BsBellFill, BsThreeDots } from 'react-icons/bs'
import { Loading } from '@/components/loading'
import { PopupMessage } from '@/components/popupMessage'
import { usePostRating } from '@/hooks/usePostRating'
import { usePostFollow } from '@/hooks/usePostFollow'

const Post = () => {
  const router = useRouter()
  const { pid } = router.query as { pid: string }
  const postId = parseInt(pid)

  const [age, setAge] = useState('')
  const [editedAge, setEditedAge] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const { data: post, refetch } = trpc.useQuery(['post.byId', { id: postId }])
  const [showPopup, setShowPopup] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const { data: user } = trpc.useQuery(['user.me'])
  const removePostMutation = trpc.useMutation(['post.remove'])
  const [handleFollow, isFollowed] = usePostFollow(postId)
  const [handleLike, handleDislike, isLiked, isDisliked] = usePostRating(postId)

  useEffect(() => {
    if (post) {
      if (!age) {
        const createdAt = post.created_at.toString()
        const updatedAt = post.updated_at?.toString()
        setAge(getDateAge(createdAt))

        if (createdAt !== updatedAt && updatedAt) {
          setEditedAge(getDateAge(updatedAt))
        }
      }
      if (!scrolled) {
        document.querySelector(`#${router.asPath.split('#')[1]}`)?.scrollIntoView()
        setScrolled(true)
      }
    }

    const handleOptionsHide = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.id === 'post-options' || target.id === 'post-options-icon') return
      if (target.parentElement) {
        if (
          target.parentElement.id === 'post-options' ||
          target.parentElement.id === 'post-options-icon'
        )
          return
      }
      setShowOptions(false)
    }

    document.addEventListener('click', handleOptionsHide)

    return () => {
      document.removeEventListener('click', handleOptionsHide)
    }
  }, [router, post, age, scrolled])

  if (!post) {
    return <Loading />
  }

  const handleAddBookmark = () => {
    setIsBookmarked(true)
  }

  const handleRemoveBookmark = () => {
    setIsBookmarked(false)
  }

  const refetchPost = async () => {
    await refetch()
  }

  const handleRemovePost = async () => {
    try {
      await removePostMutation.mutateAsync({
        id: postId
      })
      router.push('/?postRemoved=true')
    } catch (e) {
      setShowPopup(true)
    }
  }

  return (
    <>
      <Header />
      <div className='flex justify-center h-max min-h-full bg-gradient-to-tr from-main-purple-light to-main-purple via-main-purple-dark'>
        <div className='w-4/5 bg-[#212529] p-20 min-h-full pb-[100vh]'>
          <div className='flex border-b-2 p-8 mb-12 items-center border-b-white border-opacity-50 rounded-sm'>
            <Avatar username={post.author.username} />
            <Link
              href={`/user/${post.author.username}`}
              passHref
            >
              <a>
                <span className='ml-2 font-bold pr-2 cursor-pointer'>{post.author.username}</span>
              </a>
            </Link>
            <span className='text-gray-400 text-xs'>&#8226;</span>
            <span className='pl-2 text-sm text-gray-500'>{age}</span>
            {editedAge && (
              <>
                <span className='pl-2 pr-2 text-gray-500'>|</span>
                <span className='text-sm text-gray-500'>Edited {editedAge}</span>
              </>
            )}
          </div>
          <div className='mb-10 flex'>
            <h1 className='text-4xl break-words w-5/6'>{post.title}</h1>
            <div className='ml-auto h-max relative'>
              <div
                id='post-options-icon'
                className='cursor-pointer'
                onClick={() => setShowOptions((s) => !s)}
              >
                <div className='pointer-events-none'>
                  <BsThreeDots size={24} />
                </div>
              </div>
              {showOptions && (
                <ul
                  id='post-options'
                  className='absolute bg-gray-900 rounded shadow-black shadow border-[1px] border-slate-800 right-0 font-medium'
                >
                  {user?.id === post.authorId && (
                    <Link
                      href={`/view-post/${postId}/edit`}
                      passHref
                    >
                      <li className='pl-3 pr-3 pb-1 pt-1 text-center whitespace-nowrap cursor-pointer text-sm border-b-[1px] border-slate-800 hover:bg-gray-800'>
                        Edit post
                      </li>
                    </Link>
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
                  <Link
                    href={`/topic/${encodeURIComponent(topic)}`}
                    key={i}
                    passHref
                  >
                    <a>
                      <div className='bg-main-purple-light rounded-2xl h-max pt-1 pb-1 pr-3 pl-3 shadow-lg cursor-pointer mr-4'>
                        {topic}
                      </div>
                    </a>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className='flex h-[6rem] mt-14 w-full'>
            <div className='h-full w-max rounded-tl rounded-bl bg-midnight'>
              <div className='h-2/4 min-w-[4.5rem] flex justify-center items-center'>
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
              <div className='h-2/4 p-4 flex justify-center items-center'>
                <span>{post._count.likes}</span>
              </div>
            </div>
            <div className='h-full w-max rounded-bl bg-midnight'>
              <div className='h-2/4 min-w-[4.5rem] flex justify-center items-center'>
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
              <div className='h-2/4 p-4 flex justify-center items-center'>
                <span>{post._count.dislikes}</span>
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
        </div>
      </div>
      {showPopup && (
        <PopupMessage
          message='Something went wrong while trying to remove the post. Please try again.'
          showPopup={true}
        />
      )}
    </>
  )
}

export default Post
