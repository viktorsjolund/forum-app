import { AiOutlineMenu, AiFillBell } from 'react-icons/ai'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { trpc } from '@/utils/trpc'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import type { role } from '@prisma/client'

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
  const [showDropdown, setShowDropdown] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const logout = trpc.useMutation(['user.logout'])
  const router = useRouter()
  const [errorTimeoutRef, setErrorTimeoutRef] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleDropdownHide = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.id === 'header-avatar' || target.id === 'header-dropdown') return
      if (target.parentElement) {
        if (target.parentElement.id === 'header-dropdown') return
      }
      setShowDropdown(false)
    }
    document.addEventListener('click', handleDropdownHide)

    return () => {
      document.removeEventListener('click', handleDropdownHide)
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

  return (
    <>
      <AiFillBell
        size={25}
        className='mr-5 cursor-pointer'
      />
      <div className='mr-10 h-full flex items-center flex-col justify-center'>
        <div
          className='overflow-hidden rounded-full border-2 w-10 h-10 cursor-pointer'
          id='header-avatar'
          onClick={() => setShowDropdown((sd) => !sd)}
        >
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
      {showDropdown && (
        <ul
          className='absolute top-12 right-8 bg-gray-900 pr-2 pl-2 pt-1 pb-1 rounded shadow-black shadow border-[1px] border-slate-800'
          id='header-dropdown'
        >
          <li className='pl-14 pr-14 pb-1 text-center'>
            <span className='pointer-events-none'>{username}</span>
            {role && <span className='ml-2 border-[1px] rounded p-1 font-bold text-xs mt-auto mb-auto bg-purple-500 pointer-events-none'>{role}</span>}
          </li>
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
