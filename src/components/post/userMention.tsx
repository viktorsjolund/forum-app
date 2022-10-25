import Link from 'next/link'

type UserMentionProps = {
  username: string
}

export const UserMention = (props: UserMentionProps) => {
  const { username } = props
  return (
    <Link href={`/account/${encodeURIComponent(username.replace('@', ''))}`}>
      <a>
        <span className='bg-main-purple rounded p-1 mr-1 cursor-pointer hover:bg-main-purple-light'>
          {username}
        </span>
      </a>
    </Link>
  )
}
