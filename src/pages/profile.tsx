import { Header } from '@/components/header'
import { Loading } from '@/components/loading'
import { trpc } from '@/utils/trpc'
import type { user } from '@prisma/client'
import { useState } from 'react'

type MenuItemProps = {
  title: string
  onClick: () => void
}

const MenuItem = (props: MenuItemProps) => {
  return (
    <div
      onClick={props.onClick}
      className='border-b-2 h-16 border-l-2 border-t-2 bg-midnight border-[#ffffff3c] flex justify-center items-center cursor-pointer'
    >
      <span className='font-bold text-lg'>{props.title}</span>
    </div>
  )
}

type ProfileInfoProps = {
  user: user
}

const ProfileInfo = (props: ProfileInfoProps) => {
  const { user } = props

  return (
    <div className='w-full h-full'>
      <span>{user.email}</span>
    </div>
  )
}

const Profile = () => {
  const [showInfo, setShowInfo] = useState(true)
  const { data } = trpc.useQuery(['user.me'])

  if (!data) {
    return <Loading />
  }

  return (
    <>
      <Header />
      <div className='w-full h-full flex justify-center items-center'>
        <div className='w-3/4 h-full bg-[#212529]'>
          <div className='w-1/5 h-full border-r-2 border-[#ffffff3c]'>
            <MenuItem
              title='Profile Information'
              onClick={() => setShowInfo(true)}
            />
            <MenuItem
              title='Profile Information'
              onClick={() => setShowInfo(false)}
            />
            <MenuItem
              title='Profile Information'
              onClick={() => setShowInfo(false)}
            />
            <MenuItem
              title='Profile Information'
              onClick={() => setShowInfo(false)}
            />
          </div>
          <div className='w-4/5 h-full'>{showInfo && <ProfileInfo user={data} />}</div>
        </div>
      </div>
    </>
  )
}

export default Profile
