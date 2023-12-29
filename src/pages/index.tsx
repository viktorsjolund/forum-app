import { Header } from '@/components/header'
import { PopupMessage } from '@/components/popupMessage'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()

  return (
    <>
      <div className='min-h-full'>
        <Header />
        <Link
          href='/trending'
          passHref
        >
          <div>
            <span className='cursor-pointer'>Trending</span>
          </div>
        </Link>
        {router.query.postRemoved === 'true' && (
          <PopupMessage message='Post was successfully removed.' showPopup={true} />
        )}
      </div>
    </>
  )
}

export default Home
