import Link from 'next/link'
import Image from 'next/image'

type AvatarProps = {
  username: string
}

export const Avatar = (props: AvatarProps) => {
  const { username } = props

  return (
    <>
      <Link
        href={`/user/${username}`}
        passHref
      >
        <a>
          <Image
            src='/images/avatar.png'
            alt='avatar'
            width={40}
            height={40}
            layout='fixed'
            className='rounded-full cursor-pointer'
          />
        </a>
      </Link>
    </>
  )
}
