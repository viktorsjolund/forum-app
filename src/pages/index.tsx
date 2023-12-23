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
            <span className='cursor-pointer'>Trending</span>
          </div>
        </Link>
      </div>
    </>
  )
}

export default Home
