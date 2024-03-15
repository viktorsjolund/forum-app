import Link from 'next/link'
import Image from 'next/image'

type AvatarProps = {
  username: string
  src?: string | null
  width?: number
  height?: number
}

export const Avatar = (props: AvatarProps) => {
  const { username, src, width, height } = props

  return (
    <Link href={`/user/${encodeURIComponent(username)}`}>
      <Image
        src={src ? src : '/images/avatar.png'}
        alt='avatar'
        width={width || 40}
        height={height || 40}
        className='rounded-full cursor-pointer'
      />
    </Link>
  )
}
