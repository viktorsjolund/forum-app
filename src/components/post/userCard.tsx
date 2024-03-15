import Link from 'next/link'
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import autoAnimate from '@formkit/auto-animate'
import { trpc } from '@/utils/trpc'
import { VscLoading } from 'react-icons/vsc'
import { Avatar } from '../avatar'
import { UserMention } from './userMention'
import moment from 'moment'

type TUserCardProps = {
  username: string
  createdAt: Date
  updatedAt: Date
  content: string
  commentId: string
  avatar?: string | null
  refetchPost: () => Promise<void>
}

export const UserCard = (props: TUserCardProps) => {
  const {
    username,
    createdAt,
    updatedAt,
    content,
    commentId,
    refetchPost,
    avatar,
  } = props
  const [age, setAge] = useState('')
  const [rows, setRows] = useState(1)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyFormContent, setReplyFormContent] = useState(`@${username} `)
  const [isRefetching, setIsRefetching] = useState(false)
  const replyFormRef = useRef(null)
  const addReply = trpc.reply.add.useMutation()

  const filteredContent = useCallback(() => {
    const words = content.split(' ')
    return (
      <span className='whitespace-pre-wrap'>
        {words.map((word, i) => {
          return (
            <>
              {word.includes('@') && word.length !== 1 ? (
                <UserMention username={word} />
              ) : (
                <>{word}</>
              )}
              <>{i !== words.length - 1 && ' '}</>
            </>
          )
        })}
      </span>
    )
  }, [content])

  useEffect(() => {
    if (!age) {
      setAge(moment(createdAt).fromNow())
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
    <div className='pb-1 border-2 border-midnight-light rounded'>
      <div className='border-b border-midnight-light'>
        <div className='flex items-center space-x-2 pl-2 pr-4 pb-2 pt-2'>
          <Avatar src={avatar} username={username} width={26} height={26} />
          <Link href={`/user/${encodeURIComponent(username)}`}>
            <span className='cursor-pointer max-w-max font-bold'>
              {username}
            </span>
          </Link>
          <span className='text-xs text-gray-400'>{age}</span>
        </div>
      </div>
      <div className='pt-2 pb-2 pl-4'>{filteredContent()}</div>
      <div className='pl-4 border-t border-midnight-light pt-1'>
        <span
          className='cursor-pointer text-gray-400 max-w-max text-sm hover:text-white transition-colors'
          onClick={toggleReplyForm}
        >
          Reply
        </span>
      </div>
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
                {isRefetching ? (
                  <VscLoading size={20} className='animate-spin' />
                ) : (
                  'REPLY'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
