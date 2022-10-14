import { BiLoaderCircle } from 'react-icons/bi'

export const Loading = () => {
  return (
    <div className='h-full flex justify-center items-center'>
      <BiLoaderCircle
        size={100}
        className='animate-[spin_2.5s_linear_infinite]'
      />
    </div>
  )
}
