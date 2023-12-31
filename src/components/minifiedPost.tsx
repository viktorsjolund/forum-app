import { AiFillDislike, AiFillLike } from 'react-icons/ai'
import { FaCommentDots } from "react-icons/fa"
import type { post, post_like, post_dislike, user, post_comment } from '@prisma/client'
import Link from 'next/link'
import moment from 'moment'

type TMinifiedPostProps = {
  post: post & {
    likes: post_like[]
    dislikes: post_dislike[]
    author: user
    comments: post_comment[]
  }
}

export const MinifiedPost = (props: TMinifiedPostProps) => {
  const { post } = props

  return (
    <Link
      href={`/view-post/${post.id}`}
      passHref
    >
      <div className='flex h-20 bg-midnight-dark border-[1px] border-slate-700 rounded p-2 w-full cursor-pointer hover:border-main-purple-light transition-colors'>
        <div className='flex flex-col h-full justify-center border-r-2 border-slate-800 pr-2 w-fit min-w-[5rem]'>
          <div className='flex items-center mb-1'>
            <AiFillLike />
            <span className='pl-2 text-gray-300 text-sm'>{post.likes.length}</span>
          </div>
          <div className='flex items-center mb-1'>
            <AiFillDislike />
            <span className='pl-2 text-gray-300 text-sm'>{post.dislikes.length}</span>
          </div>
          <div className='flex items-center'>
            <FaCommentDots />
            <span className='pl-2 text-gray-300 text-sm'>{post.comments.length}</span>
          </div>
        </div>
        <div className='pl-4 flex flex-col w-3/4'>
          <span className='font-extrabold text-[1em] leading-5 h-fit break-words'>{post.title}</span>
        </div>
        <div className='ml-auto flex flex-col'>
        <span className='text-sm h-fit ml-auto'>
          by
          <Link
            href={`/account/${post.author.username}`}
            passHref
          >
            <span className='font-bold underline pl-1 hover:text-main-purple-light transition-colors'>
              {post.author.username}
            </span>
          </Link>
        </span>
        <span className='text-xs h-fit mt-auto ml-auto text-gray-500'>
          Posted on: {moment(post.created_at.toString(), 'YYYY-MM-DD HH:mm:ss').format('lll')}
        </span>
        <span className='text-xs h-fit mt-auto text-gray-500'>
          Last edited: {moment(post.updated_at?.toString(), 'YYYY-MM-DD HH:mm:ss').format('lll')}
        </span>
        </div>
      </div>
    </Link>
  )
}
