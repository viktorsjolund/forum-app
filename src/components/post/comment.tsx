import type { post_comment, user, post_reply } from '@prisma/client'
import { useEffect, useRef, useState } from 'react'
import { Replies } from './replies'
import autoAnimate from '@formkit/auto-animate'
import { UserCard } from './userCard'
import { IoMdArrowDropup, IoMdArrowDropdown } from 'react-icons/io'

type TCommentProps = {
  comment: post_comment & {
    author: user
    replies: (post_reply & {
      author: user
    })[]
  }
  refetchPost: () => Promise<void>
}

export const Comment = (props: TCommentProps) => {
  const { comment, refetchPost } = props
  const [showReplies, setShowReplies] = useState(false)
  const repliesDropdownRef = useRef(null)

  const toggleReplies = () => {
    setShowReplies(!showReplies)
  }

  const showAllReplies = () => {
    setShowReplies(true)
  }

  useEffect(() => {
    repliesDropdownRef.current && autoAnimate(repliesDropdownRef.current)
  }, [])

  return (
    <div className='mb-8 scroll-m-14' id={`comment-nr-${comment.id}`}>
      <UserCard
        content={comment.content}
        createdAt={comment.created_at}
        updatedAt={comment.updated_at}
        username={comment.author.username}
        commentId={comment.id}
        refetchPost={refetchPost}
        showReplies={showAllReplies}
      />
      <div
        className='m-1'
        ref={repliesDropdownRef}
      >
        {comment.replies.length > 0 && (
          <div
            className='flex items-center justify-center cursor-pointer w-max'
            onClick={toggleReplies}
          >
            {showReplies ? (
              <IoMdArrowDropup fill='rgb(123 44 191)' />
            ) : (
              <IoMdArrowDropdown fill='rgb(123 44 191)' />
            )}
            <span className='text-main-purple-light'>{comment.replies.length} replies</span>
          </div>
        )}
        {showReplies && (
          <Replies
            replies={comment.replies}
            refetchPost={refetchPost}
            showReplies={showAllReplies}
          />
        )}
      </div>
    </div>
  )
}
