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
      <div className='flex justify-center h-max min-h-full bg-gradient-to-tr from-main-purple-light to-main-purple via-main-purple-dark'>
        <div className='w-4/5 bg-[#212529] min-h-full pb-[100vh]'>
          <ul className='flex bg-midnight w-full border-t-2 border-l-2 border-midnight'>
            <Link
              href={`/user/${username}`}
              passHref
            >
              <li
                className={`pl-4 pt-1 pr-4 pb-1 cursor-pointer border-b-2 bg-midnight-light border-midnight ${
                  router.pathname === '/user/[uname]'
                    ? 'border-b-2 border-b-main-purple-light'
                    : 'hover:border-b-main-purple hover:bg-midnight-lighter'
                }`}
              >
                Posts
              </li>
            </Link>
            <Link
              href={`/user/${username}/liked`}
              passHref
            >
              <li
                className={`pl-4 pt-1 pr-4 pb-1 cursor-pointer border-b-2 bg-midnight-light border-midnight hover:border-b-main-purple ${
                  router.pathname === '/user/[uname]/liked'
                    ? 'border-b-2 border-b-main-purple-light'
                    : 'hover:border-b-main-purple hover:bg-midnight-lighter'
                }`}
              >
                Liked
              </li>
            </Link>
            <Link
              href={`/user/${username}/saved`}
              passHref
            >
              <li
                className={`pl-4 pt-1 pr-4 pb-1 cursor-pointer  border-b-2 bg-midnight-light border-midnight hover:border-b-main-purple ${
                  router.pathname === '/user/[uname]/saved'
                    ? 'border-b-2 border-b-main-purple-light'
                    : 'hover:border-b-main-purple hover:bg-midnight-lighter'
                }`}
              >
                Saved
              </li>
            </Link>
            <li className='w-full border-b-2 border-midnight border-r-2 bg-midnight-light'></li>
          </ul>
          <div className='min-h-screen h-fit bg-midnight rounded-tr rounded-bl rounded-br shadow-lg'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
