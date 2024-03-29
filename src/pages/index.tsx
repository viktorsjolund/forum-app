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
          href='/browse'
          passHref
        >
          <div>
            <span className='cursor-pointer'>Browse</span>
          </div>
        </Link>
        {router.query.postRemoved === 'true' && (
          <PopupMessage
            message='Post was successfully removed.'
            show={true}
          />
        )}
      </div>
    </>
  )
}

export default Home
