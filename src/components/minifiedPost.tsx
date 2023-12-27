import { AiFillDislike, AiFillLike } from 'react-icons/ai'
import type { post, post_like, post_dislike, user, post_comment } from '@prisma/client'
import Link from 'next/link'

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
      <div className='flex h-20 bg-midnight-dark border-b-[1px] rounded p-2 w-full cursor-pointer'>
        <div className='flex flex-col h-full items-center justify-center border-r-2 pr-2'>
          <div className='flex items-center mb-2'>
            <AiFillLike />
            <span className='pl-2 text-gray-300 text-sm'>{post.likes.length}</span>
          </div>
          <div className='flex items-center'>
            <AiFillDislike />
            <span className='pl-2 text-gray-300 text-sm'>{post.dislikes.length}</span>
          </div>
        </div>
        <div className='pl-4 flex flex-col'>
          <span className='font-extrabold text-2xl h-fit'>{post.title}</span>
          <span className='text-sm mt-auto text-gray-300'>Comments: {post.comments.length}</span>
        </div>
        <div className='ml-auto flex flex-col'>
        <span className='text-sm h-fit ml-auto'>
          by
          <Link
            href={`/account/${post.author.username}`}
            passHref
          >
            <span className='font-bold underline pl-1 hover:text-main-purple-light'>
              {post.author.username}
            </span>
          </Link>
        </span>
        <span className='text-xs h-fit mt-auto ml-auto'>
          Posted on: {post.created_at.toString()}
        </span>
        <span className='text-xs h-fit mt-auto'>
          Last edited: {post.updated_at.toString()}
        </span>
        </div>
      </div>
    </Link>
  )
}
