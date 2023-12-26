import type { ReactNode } from 'react'
import { Header } from './header'
import type { Me } from '@/types/types'
import Link from 'next/link'
import { useRouter } from 'next/router'

type TProfileTemplateProps = {
  children: ReactNode
  me?: Me | null
  username: string
}

export const ProfileTemplate = ({ children, me, username }: TProfileTemplateProps) => {
  const router = useRouter()

  return (
    <div>
      <Header />
      <div className='p-14'>
        <ul className='flex bg-midnight w-fit rounded'>
          <Link
            href={`/account/${username}`}
            passHref
          >
            <li
              className={`pl-4 pt-1 pr-4 pb-1 cursor-pointer border-2 rounded-tl border-midnight-light border-r-0 ${
                router.pathname === '/account/[uname]'
                  ? 'border-b-2 border-b-main-purple-light'
                  : 'hover:border-b-main-purple'
              }`}
            >
              Posts
            </li>
          </Link>
          <Link
            href={`/account/${username}/liked`}
            passHref
          >
            <li
              className={`pl-4 pt-1 pr-4 pb-1 cursor-pointer border-2 border-midnight-light border-r-0 border-l-0 hover:border-b-main-purple ${
                router.pathname === '/account/[uname]/liked'
                  ? 'border-b-2 border-b-main-purple-light'
                  : 'hover:border-b-main-purple'
              }`}
            >
              Liked
            </li>
          </Link>
          <Link
            href={`/account/${username}/saved`}
            passHref
          >
            <li
              className={`pl-4 pt-1 pr-4 pb-1 cursor-pointer  border-2 border-midnight-light border-l-0 rounded-tr hover:border-b-main-purple ${
                router.pathname === '/account/[uname]/saved'
                  ? 'border-b-2 border-b-main-purple-light'
                  : 'hover:border-b-main-purple'
              }`}
            >
              Saved
            </li>
          </Link>
        </ul>
        <div className='min-h-screen h-fit bg-midnight rounded-tr rounded-bl rounded-br shadow-lg'>
          {children}
        </div>
      </div>
    </div>
  )
}
