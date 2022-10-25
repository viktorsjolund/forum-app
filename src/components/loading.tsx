import { BiLoaderCircle } from 'react-icons/bi'
import { Header } from './header'

export const Loading = () => {
  return (
    <>
      <Header />
      <div className='h-full flex justify-center items-center bg-gradient-to-tr from-main-purple-light to-main-purple via-main-purple-dark animate-gradient-x'></div>
    </>
  )
}
