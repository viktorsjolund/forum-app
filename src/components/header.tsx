import { AiOutlineMenu, AiFillBell } from 'react-icons/ai'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

export const Header = () => {
  const router = useRouter()

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
                router.pathname === '/' ? 'bg-main-purple-dark' : 'hover:bg-[#343434] transition-colors'
              }`}
            >
              Astrom
            </span>
          </a>
        </Link>
      </div>
      <div className='ml-auto flex items-center'>
        <AiFillBell
          size={25}
          className='mr-5 cursor-pointer'
        />
        <Link href='/profile'>
          <div className='mr-10 cursor-pointer h-full flex items-center'>
            <Image
              src='/images/avatar.png'
              alt='avatar'
              width={35}
              height={35}
              className='rounded-full'
            />
          </div>
        </Link>
      </div>
    </div>
  )
}
