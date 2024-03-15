import {
  AiFillDislike,
  AiFillLike,
  AiOutlineLike,
  AiOutlineDislike,
} from 'react-icons/ai'
import { FaCommentDots } from 'react-icons/fa'
import type { post, User } from '@prisma/client'
import Link from 'next/link'
import moment from 'moment'
import { usePostRating } from '@/hooks/usePostRating'
import { IconContext } from 'react-icons'
import { getPostTitleSlug } from '@/utils/slug'

type TMinifiedPostProps = {
  post: post & {
    author: User
    _count: {
      likes: number
      dislikes: number
      comments: number
    }
  }
  ratingChangeCb?: () => void
}

export const MinifiedPost = (props: TMinifiedPostProps) => {
  const { post, ratingChangeCb } = props
  const [handleLike, handleDislike, isLiked, isDisliked] = usePostRating(
    post.id,
  )

  const handleLikeClick = async () => {
    await handleLike()
    ratingChangeCb && ratingChangeCb()
  }

  const handleDislikeClick = async () => {
    await handleDislike()
    ratingChangeCb && ratingChangeCb()
  }

  return (
    <div className='flex h-22 bg-midnight-dark border-[1px] border-slate-700 rounded p-2 w-full cursor-pointer hover:border-main-purple-light transition-colors'>
      <div className='flex flex-col h-full justify-center border-r-2 border-slate-800 pr-2 w-fit min-w-[5rem]'>
        <div className='flex items-center mb-1'>
          <IconContext.Provider
            value={{
              className:
                'hover:fill-blue-500 w-full h-full p-1 transition-colors',
            }}
          >
            <div
              className='hover:bg-midnight rounded'
              onClick={handleLikeClick}
            >
              {isLiked ? <AiFillLike /> : <AiOutlineLike />}
            </div>
          </IconContext.Provider>
          <span className='pl-2 text-gray-300 text-sm'>
            {post._count.likes}
          </span>
        </div>
        <div className='flex items-center mb-1'>
          <IconContext.Provider
            value={{
              className:
                'hover:fill-red-500 w-full h-full p-1 transition-colors',
            }}
          >
            <div
              className='hover:bg-midnight rounded'
              onClick={handleDislikeClick}
            >
              {isDisliked ? <AiFillDislike /> : <AiOutlineDislike />}
            </div>
          </IconContext.Provider>
          <span className='pl-2 text-gray-300 text-sm'>
            {post._count.dislikes}
          </span>
        </div>
        <div className='flex items-center'>
          <div className='p-1'>
            <FaCommentDots />
          </div>
          <span className='pl-2 text-gray-300 text-sm'>
            {post._count.comments}
          </span>
        </div>
      </div>
      <Link
        href={`/view-post/${post.id}/${getPostTitleSlug(post.title)}`}
        className='w-full'
      >
        <div className='w-full h-full flex-col'>
          <div className='flex'>
            <div className='pl-4 flex flex-col w-3/4'>
              <span className='font-extrabold text-[1em] leading-5 h-fit break-words'>
                {post.title}
              </span>
            </div>
            <div className='ml-auto flex flex-col'>
              <span className='text-sm h-fit ml-auto'>
                <span>by</span>
                <span className='font-bold underline pl-1 transition-colors'>
                  {post.author.username}
                </span>
              </span>
              <span className='text-xs h-fit mt-auto ml-auto text-gray-500'>
                Posted on: {moment(post.created_at).format('lll')}
              </span>
              {post.created_at.getTime() !== post.updated_at?.getTime() && (
                <span className='text-xs h-fit mt-auto ml-auto text-gray-500'>
                  Last edited: {moment(post.updated_at).format('lll')}
                </span>
              )}
            </div>
          </div>
          <div className='w-full pl-4 pr-4 flex'>
            {post.topic?.split(',').map((t, i) => (
              <div
                key={i}
                className='bg-slate-800 rounded-2xl pt-1 pb-1 pr-3 pl-3 shadow-lg w-fit text-sm text-gray-300 font-semibold mr-2 last:mr-0'
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </Link>
    </div>
  )
}
