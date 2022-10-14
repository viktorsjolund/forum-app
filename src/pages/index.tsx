import { Header } from '@/components/header'
import Link from 'next/link'

const Home = () => {
  return (
    <>
      <Header />
      <div className='flex'>
        <Link
          href='/trending'
          passHref
        >
          <div>
            <span>Trending</span>
          </div>
        </Link>
      </div>
      <div className='flex w-full h-full bg-black flex-col'>
        <div className='h-20 w-full bg-midnight m-2'></div>
        <div className='h-20 w-full bg-midnight m-2'></div>
        <div className='h-20 w-full bg-midnight m-2'></div>
        <div className='h-20 w-full bg-midnight m-2'></div>
        <div className='h-20 w-full bg-midnight m-2'></div>
        <div className='h-20 w-full bg-midnight m-2'></div>
        <div className='h-20 w-full bg-midnight m-2'></div>
      </div>
    </>
  )
}

export default Home
