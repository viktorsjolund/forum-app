import { AiOutlineMenu, AiFillBell, AiOutlineBell } from 'react-icons/ai'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { trpc } from '@/utils/trpc'
import Image from 'next/image'
import { useState } from 'react'
import type { role } from '@prisma/client'
import { CgProfile, CgUser } from 'react-icons/cg'
import { IoIosLogOut } from 'react-icons/io'
import { signOut } from 'next-auth/react'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import moment from 'moment'

const LoggedOut = () => {
  return (
    <div className='pr-10'>
      <span className='text-lg hover:font-bold'>
        <Link href='/auth/login'>Login</Link>
      </span>
    </div>
  )
}

type TLoggedInProps = {
  username?: string | null
  role: role | null
  avatar?: string | null
}

const LoggedIn = (props: TLoggedInProps) => {
  const { username, role, avatar } = props
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false)
  const [showNotiDropdown, setShowNotiDropdown] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { data: notifications, refetch: refetchNotifications } =
    trpc.notification.byUser.useQuery()
  const viewedNotificationMutation = trpc.notification.viewed.useMutation()
  const { ref: avatarRef, triggerRef: avatarTriggerRef } = useOutsideClick<
    HTMLUListElement,
    HTMLDivElement
  >(() => setShowAvatarDropdown(false))
  const { ref: notiRef, triggerRef: notiTriggerRef } =
    useOutsideClick<HTMLUListElement>(() => setShowNotiDropdown(false))

  const handleNotification = async (notificationId: number) => {
    await viewedNotificationMutation.mutateAsync({
      notificationId,
    })
    refetchNotifications()
  }

  return (
    <>
      <div className='mr-5'>
        <Link href='/create-post' passHref>
          <div className='flex leading-6 transition-colors justify-center items-center pr-4 pl-4 pb-1 pt-1 w-full h-full rounded bg-main-purple hover:bg-main-purple-dark shadow-lg font-medium text-sm'>
            Create a post
          </div>
        </Link>
      </div>
      <div className='mr-5 relative'>
        <div
          className='cursor-pointer'
          onClick={() => setShowNotiDropdown((s) => !s)}
          ref={notiTriggerRef}
        >
          <div className='pointer-events-none'>
            {showNotiDropdown ? (
              <AiFillBell size={30} />
            ) : (
              <AiOutlineBell size={30} />
            )}
          </div>
          {notifications && notifications.length > 0 && (
            <div className='absolute h-4 w-4 top-0 right-0 bg-red-600 rounded-full flex justify-center items-center'>
              <span className='text-[0.6rem] font-bold h-fit w-fit text-center'>
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            </div>
          )}
        </div>
        {showNotiDropdown && (
          <ul
            className='absolute h-44 w-60 top-8 right-0 bg-gray-900 rounded shadow-black shadow border-[1px] border-slate-800 overflow-y-scroll'
            ref={notiRef}
          >
            {notifications?.map((notification) => {
              return (
                <Link
                  href={`/view-post/${notification.post_id}#${notification.element_id}`}
                  key={notification.id}
                  passHref
                >
                  <li
                    className='cursor-pointer p-1 bg-gray-800 rounded leading-3 border-[1px] border-slate-700 mb-1 last-of-type:mb-0 hover:bg-slate-600 transition-colors'
                    onClick={() => handleNotification(notification.id)}
                  >
                    {notification.trigger === 'COMMENT' && (
                      <>
                        <span className='text-xs'>
                          User{' '}
                          <span className='font-bold'>
                            {notification.user.username}
                          </span>{' '}
                          commented on{' '}
                          <span className='font-bold'>{`"${notification.post.title}"`}</span>{' '}
                          <span>
                            {moment(notification.created_at).fromNow()}
                          </span>
                        </span>
                      </>
                    )}
                  </li>
                </Link>
              )
            })}
          </ul>
        )}
      </div>
      <div
        className='mr-10 h-full flex items-center flex-row justify-center cursor-pointer'
        onClick={() => setShowAvatarDropdown((sd) => !sd)}
        ref={avatarTriggerRef}
      >
        <div className='overflow-hidden rounded-full border-2 w-10 h-10'>
          <div>
            <Image
              src={avatar ? avatar : '/images/avatar.png'}
              alt='avatar'
              className='w-full h-auto'
              width={35}
              height={35}
            />
          </div>
        </div>
      </div>
      {showAvatarDropdown && (
        <ul
          className='absolute top-12 right-8 bg-gray-900 rounded shadow-black shadow border-[1px] border-slate-800 font-medium'
          ref={avatarRef}
        >
          <li className='pb-1 pt-1 text-center flex items-center pr-8'>
            <div className='pl-4 pr-4'>
              <CgUser />
            </div>
            <span>{username}</span>
            {role && (
              <span className='ml-2 border-[1px] rounded p-1 font-bold text-xs mt-auto mb-auto bg-purple-500'>
                {role}
              </span>
            )}
          </li>
          <Link href={`/user/${username}`} passHref>
            <li className='pb-1 pt-1 text-center cursor-pointer border-t-[1px] border-slate-800 hover:bg-gray-800 transition-colors flex items-center pr-4'>
              <div className='pl-4 pr-4'>
                <CgProfile />
              </div>
              <span>My Profile</span>
            </li>
          </Link>
          <li
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className='border-t-[1px] border-slate-800 pb-1 pt-1 cursor-pointer text-center hover:bg-gray-800 transition-colors flex items-center'
          >
            <div className='pl-4 pr-4'>
              <IoIosLogOut />
            </div>
            <span>Logout</span>
          </li>
        </ul>
      )}
      {errorMessage && (
        <div className='absolute top-4 left-2/4 p-3 bg-slate-900 border-white border-[1px] pointer-events-none'>
          {errorMessage}
        </div>
      )}
    </>
  )
}

export const Header = () => {
  const router = useRouter()
  const { data: user, isLoading } = trpc.user.me.useQuery()

  return (
    <div className='h-14 w-full bg-[#212121] flex sticky top-0 z-50'>
      <div className='flex items-center'>
        <div className='ml-3 cursor-pointer rounded-full hover:bg-[#343434] p-3 transition-colors'>
          <AiOutlineMenu size={25} />
        </div>
        <Link href='/' passHref>
          <span
            className={`pl-3 pt-2 pr-3 pb-2 ml-6 font-semibold text-lg rounded ${
              router.pathname === '/'
                ? 'bg-main-purple-dark'
                : 'hover:bg-[#343434] transition-colors'
            }`}
          >
            Astrom
          </span>
        </Link>
      </div>
      <div className='ml-auto flex items-center'>
        {isLoading || !user ? (
          <LoggedOut />
        ) : (
          <LoggedIn
            avatar={user.image}
            username={user.username}
            role={user.role}
          />
        )}
      </div>
    </div>
  )
}
