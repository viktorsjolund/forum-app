import { getDateAge } from '@/utils/timeCalculator'
import Link from 'next/link'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import autoAnimate from '@formkit/auto-animate'
import { trpc } from '@/utils/trpc'
import Image from 'next/image'
import { VscLoading } from 'react-icons/vsc'
import { Avatar } from '../avatar'

type TUserCardProps = {
  username: string
  createdAt: Date
  updatedAt: Date
  content: string
  commentId: number
  refetchPost: () => Promise<void>
  showReplies: () => void
}

export const UserCard = (props: TUserCardProps) => {
  const { username, createdAt, updatedAt, content, commentId, refetchPost, showReplies } = props
  const [age, setAge] = useState('')
  const [rows, setRows] = useState(1)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyFormContent, setReplyFormContent] = useState(`@${username}, `)
  const [isRefetching, setIsRefetching] = useState(false)
  const replyFormRef = useRef(null)
  const addReply = trpc.useMutation(['reply.add'])

  useEffect(() => {
    if (!age) {
      setAge(getDateAge(createdAt.toString()))
    }

    replyFormRef.current &&
      autoAnimate(replyFormRef.current, {
        duration: 200,
      })
  }, [createdAt, age])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setReplyFormContent('')

    setIsRefetching(true)
    await addReply.mutateAsync({
      commentId,
      content: replyFormContent,
    })

    await refetchPost()
    setIsRefetching(false)
    showReplies()
  }

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm)
  }

  const handleTextarea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReplyFormContent(e.target.value)
    const rowCount = e.target.value.split('\n').length
    setRows(rowCount)
  }

  return (
    <div>
      <div className='flex items-center relative'>
        <div className='-left-11 absolute top-0 cursor-pointer'>
          <Avatar username={username} />
        </div>
        <Link
          href={`/account/${username}`}
          passHref
        >
          <span className='cursor-pointer max-w-max pr-2 pl-2 font-bold'>
            {username}
          </span>
        </Link>
        <span className='text-[#9a9a9a]'>&#8226;</span>
        <span className='ml-2 text-sm text-gray-400'>{age}</span>
      </div>
      <div className='m-2'>
        <p className='whitespace-pre-wrap'>{content}</p>
      </div>
      <span
        className='cursor-pointer text-gray-400 max-w-max pl-2'
        onClick={toggleReplyForm}
      >
        Reply
      </span>
      <div ref={replyFormRef}>
        {showReplyForm && (
          <form
            onSubmit={handleSubmit}
            className='w-full flex flex-col rounded-t-md mt-3 font-medium'
          >
            <div className='w-full flex flex-col bg-midnight rounded-t-md'>
              <label
                htmlFor='reply'
                className='text-gray-300 text-sm pt-1 pb-1 pl-3 pr-3'
              >
                Make a reply
              </label>
              <textarea
                value={replyFormContent}
                onChange={handleTextarea}
                id='reply'
                required
                rows={1}
                style={{ height: `${rows * 1.5 + 1}rem` }}
                className='bg-midnight pr-3 pb-1 pl-3 pt-1 focus:border-b-gray-50 hover:border-b-gray-50 focus:border-b-2 border-b-2 border-b-gray-900 overflow-hidden'
              />
            </div>
            <div>
              <button className='flex leading-6 justify-center items-center pr-3 pl-3 pb-1 pt-1 float-right rounded w-20 h-8 bg-main-purple hover:bg-main-purple-dark shadow-lg font-medium text-sm mt-3'>
                {isRefetching ? <VscLoading size={20} className='animate-spin' /> : 'REPLY'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
