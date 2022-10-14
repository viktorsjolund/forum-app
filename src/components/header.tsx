import { AiFillHome, AiOutlineMenu, AiFillBell } from 'react-icons/ai'

export const Header = () => {
  return (
    <div className='h-16 w-full bg-black flex'>
      <div className='flex items-center'>
        <AiOutlineMenu className='ml-10'/>
        <AiFillHome />
      </div>
      <div className='ml-auto flex items-center'>
        <AiFillBell className='mr-10'/>
      </div>
    </div>
  )
}
