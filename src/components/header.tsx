import { AiOutlineMenu, AiFillBell } from 'react-icons/ai'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { trpc } from '@/utils/trpc'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import type { role } from '@prisma/client'
import { getDateAge } from '@/utils/timeCalculator'

const LoggedOut = () => {
  return (
    <div className='pr-10'>
      <span className='text-lg hover:font-bold'>
        <Link href='/account/login'>Login</Link>
      </span>
    </div>
  )
}

type TLoggedInProps = {
  username: string
  role: role | null
}

const LoggedIn = (props: TLoggedInProps) => {
  const { username, role } = props
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false)
  const [showNotiDropdown, setShowNotiDropdown] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const logout = trpc.useMutation(['user.logout'])
  const router = useRouter()
  const [errorTimeoutRef, setErrorTimeoutRef] = useState<NodeJS.Timeout | null>(null)
  const { data: notifications, refetch: refetchNotifications } = trpc.useQuery([
    'notification.byUser'
  ])
  const viewedNotificationMutation = trpc.useMutation(['notification.viewed'])

  useEffect(() => {
    const handleAvatarDropdownHide = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.id === 'header-dropdown' || target.id === 'header-profile') return
      if (target.parentElement) {
        if (target.parentElement.id === 'header-dropdown') return
      }
      setShowAvatarDropdown(false)
    }

    const handleNotiDropdownHide = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.id === 'header-noti-dropdown') return
      if (target.parentElement) {
        if (target.parentElement.id === 'header-noti-dropdown') return
      }
      setShowNotiDropdown(false)
    }

    document.addEventListener('click', handleAvatarDropdownHide)
    document.addEventListener('click', handleNotiDropdownHide)

    return () => {
      document.removeEventListener('click', handleAvatarDropdownHide)
      document.removeEventListener('click', handleNotiDropdownHide)
    }
  }, [])

  const handleLogout = async () => {
    const errorDisplayDuration = 5000

    try {
      await logout.mutateAsync()
      router.push('/account/login')
    } catch (e) {
      if (errorTimeoutRef) {
        clearTimeout(errorTimeoutRef)
      }
      setErrorTimeoutRef(setTimeout(() => setErrorMessage(''), errorDisplayDuration))
      setErrorMessage('Logout attempt failed. Please try again.')
    }
  }

  const handleNotification = async (notificationId: number) => {
    await viewedNotificationMutation.mutateAsync({
      notificationId
    })
    refetchNotifications()
  }

  return (
    <>
      <div className='mr-5 relative'>
        <div
          className='cursor-pointer relative'
          id='header-noti-dropdown'
          onClick={() => setShowNotiDropdown((s) => !s)}
        >
          <div className='pointer-events-none'>
            <AiFillBell size={30} />
          </div>
          {notifications && notifications.length > 0 && (
            <div className='absolute h-4 w-4 top-0 right-0 bg-red-600 rounded-full flex justify-center items-center pointer-events-none'>
              <span className='text-[0.6rem] font-bold h-fit w-fit text-center pointer-events-none'>
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            </div>
          )}
        </div>
        {showNotiDropdown && (
          <ul
            className='absolute h-44 w-60 top-8 right-0 bg-gray-900 rounded shadow-black shadow border-[1px] border-slate-800 overflow-y-scroll'
            id='header-dropdown'
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
                          User <span className='font-bold'>{notification.user.username}</span>{' '}
                          commented on{' '}
                          <span className='font-bold'>{`"${notification.post.title}"`}</span>{' '}
                          <span>{getDateAge(notification.created_at.toString())}</span>
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
        id='header-profile'
      >
        <span className='pr-2 pointer-events-none'>{username}</span>
        <div className='overflow-hidden rounded-full border-2 w-10 h-10 pointer-events-none'>
          <div className='pointer-events-none'>
            <Image
              src='/images/avatar.png'
              alt='avatar'
              layout='responsive'
              width={35}
              height={35}
            />
          </div>
        </div>
      </div>
      {showAvatarDropdown && (
        <ul
          className='absolute top-12 right-8 bg-gray-900 pr-2 pl-2 pt-1 pb-1 rounded shadow-black shadow border-[1px] border-slate-800'
          id='header-dropdown'
        >
          <li className='pl-14 pr-14 pb-1 text-center'>
            <span className='pointer-events-none'>{username}</span>
            {role && (
              <span className='ml-2 border-[1px] rounded p-1 font-bold text-xs mt-auto mb-auto bg-purple-500 pointer-events-none'>
                {role}
              </span>
            )}
          </li>
          <Link
            href={`/account/${username}`}
            passHref
          >
            <li className='pl-14 pr-14 pb-1 text-center cursor-pointer border-t-[1px] border-black'>
              My Profile
            </li>
          </Link>
          <li
            className='border-t-[1px] border-black pl-14 pr-14 pt-1 cursor-pointer text-center'
            onClick={handleLogout}
          >
            Logout
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
  const { data: user, isLoading } = trpc.useQuery(['user.me'])

  return (
    <div className='h-14 w-full bg-[#212121] flex sticky top-0 z-50'>
      <div className='flex items-center'>
        <div className='ml-3 cursor-pointer rounded-full hover:bg-[#343434] p-3 transition-colors'>
          <AiOutlineMenu size={25} />
        </div>
        <Link href='/'>
          <a>
            <span
              className={`pl-3 pt-2 pr-3 pb-2 ml-6 font-semibold text-lg rounded ${
                router.pathname === '/'
                  ? 'bg-main-purple-dark'
                  : 'hover:bg-[#343434] transition-colors'
              }`}
            >
              Astrom
            </span>
          </a>
        </Link>
      </div>
      <div className='ml-auto flex items-center'>
        {isLoading || !user ? (
          <LoggedOut />
        ) : (
          <LoggedIn
            username={user.username}
            role={user.role}
          />
        )}
      </div>
    </div>
  )
}
