import { trpc } from '@/utils/trpc'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export const useIsPostFollowed = (postId: number): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const { data, isLoading } = trpc.useQuery(['post.isFollowed', { postId }])
  const [isFollowed, setIsFollowed] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setIsFollowed(data!)
    }
  }, [isLoading, data])

  return [isFollowed, setIsFollowed]
}
