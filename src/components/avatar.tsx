import Link from 'next/link'
import Image from 'next/image'

type AvatarProps = {
  username?: string | null
  src?: string | null
}

export const Avatar = (props: AvatarProps) => {
  const { username, src } = props

  return (
    <>
      <Link href={`/user/${username}`}>
        <Image
          src={src ? src : '/images/avatar.png'}
          alt='avatar'
          width={40}
          height={40}
          className='rounded-full cursor-pointer'
        />
      </Link>
    </>
  )
}
