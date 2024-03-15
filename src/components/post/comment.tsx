import type { post_comment, User, post_reply } from '@prisma/client'
import { useEffect, useRef, useState } from 'react'
import autoAnimate from '@formkit/auto-animate'
import { UserCard } from './userCard'
import {
  MdArrowDownward,
  MdOutlineKeyboardDoubleArrowDown,
  MdOutlineKeyboardDoubleArrowUp,
} from 'react-icons/md'

type TCommentProps = {
  comment: post_comment & {
    author: User
    replies: (post_reply & {
      author: User
    })[]
  }
  refetchPost: () => Promise<void>
}

export const Comment = (props: TCommentProps) => {
  const { comment, refetchPost } = props
  const [repliesCount, setRepliesCount] = useState(1)
  const repliesDropdownRef = useRef(null)

  useEffect(() => {
    repliesDropdownRef.current && autoAnimate(repliesDropdownRef.current)
  }, [])

  return (
    <div
      className='scroll-m-14 p-1 border border-midnight-dark rounded bg-midnight'
      id={`comment-nr-${comment.id}`}
    >
      <UserCard
        content={comment.content}
        createdAt={comment.created_at}
        updatedAt={comment.updated_at}
        username={comment.author.username!}
        commentId={comment.id}
        refetchPost={refetchPost}
        avatar={comment.author.image}
      />
      {comment.replies.length > 0 && (
        <>
          <div className='border-b border-midnight-dark mt-2 mb-2'></div>
          <div className='flex flex-col pl-12 space-y-2'>
            {comment.replies.slice(0, repliesCount).map((reply) => (
              <UserCard
                content={reply.content}
                createdAt={reply.created_at}
                updatedAt={reply.updated_at}
                username={reply.author.username!}
                commentId={reply.comment_id}
                avatar={reply.author.image}
                refetchPost={refetchPost}
                key={reply.id}
              />
            ))}
            <div className='flex justify-between items-center'>
              <div></div>
              {repliesCount < comment.replies.length && (
                <div
                  className='cursor-pointer hover:bg-midnight-light pt-1 pb-1 pr-4 pl-4 rounded flex items-center'
                  onClick={() => setRepliesCount((s) => s + 5)}
                >
                  <MdOutlineKeyboardDoubleArrowDown className='fill-slate-300' />
                  <span className='text-sm text-slate-300'>
                    View more ({comment.replies.length - repliesCount})
                  </span>
                </div>
              )}
              <div
                className='cursor-pointer hover:bg-midnight-light pt-1 pb-1 pr-4 pl-4 rounded flex items-center'
                onClick={() => setRepliesCount(0)}
              >
                <MdOutlineKeyboardDoubleArrowUp className='fill-slate-300' />
                <span className='text-sm text-slate-300'>Hide</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
