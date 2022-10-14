import { trpc } from '@/utils/trpc'
import type { post_comment, user, post_reply } from '@prisma/client'
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Comment } from './comment'
import autoAnimate from '@formkit/auto-animate'
import { VscLoading } from 'react-icons/vsc'

type TCommentsProps = {
  comments: (post_comment & {
    author: user
    replies: (post_reply & {
      author: user
    })[]
  })[]
  postId: number
  refetchPost: () => Promise<void>
}

export const Comments = (props: TCommentsProps) => {
  const { comments, postId, refetchPost } = props
  const [content, setContent] = useState('')
  const [isRefetching, setIsRefetching] = useState(false)
  const [rows, setRows] = useState(1)
  const addComment = trpc.useMutation(['comments.add'])
  const commentsRef = useRef(null)
  const commentsReversed = useMemo(() => [...comments].reverse(), [comments])

  useEffect(() => {
    commentsRef.current && autoAnimate(commentsRef.current)
  }, [commentsRef])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setContent('')

    setIsRefetching(true)
    await addComment.mutateAsync({
      content,
      postId,
    })

    await refetchPost()
    setIsRefetching(false)
  }

  const handleTextarea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    const rowCount = e.target.value.split('\n').length
    setRows(rowCount)
  }

  return (
    <div
      ref={commentsRef}
      className='mt-20'
    >
      <form
        onSubmit={handleSubmit}
        className='w-full flex flex-col rounded-t-md mt-3 font-medium'
      >
        <div className='w-full flex flex-col bg-midnight rounded-t-md'>
          <label
            htmlFor='comment'
            className='text-gray-300 text-sm pt-1 pb-1 pl-3 pr-3'
          >
            Make a comment
          </label>
          <textarea
            value={content}
            onChange={handleTextarea}
            id='comment'
            required
            rows={1}
            style={{ height: `${rows * 1.5 + 1}rem` }}
            className='bg-midnight pr-3 pb-1 pl-3 pt-1 focus:border-b-gray-50 hover:border-b-gray-50 focus:border-b-2 border-b-2 border-b-gray-900 overflow-hidden'
          />
        </div>
        <div>
          <button className='flex leading-6 justify-center items-center pr-3 pl-3 pb-1 pt-1 float-right rounded w-20 h-8 bg-main-purple hover:bg-main-purple-dark shadow-lg font-medium text-sm mt-3'>
            {isRefetching ? (
              <VscLoading
                size={20}
                className='animate-spin'
              />
            ) : (
              'COMMENT'
            )}
          </button>
        </div>
      </form>
      {commentsReversed.map((comment) => {
        return (
          <Comment
            comment={comment}
            key={comment.id}
            refetchPost={refetchPost}
          />
        )
      })}
    </div>
  )
}
