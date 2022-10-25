import { trpc } from '@/utils/trpc'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export const usePostLiked = (postId: number): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const { data, isLoading } = trpc.useQuery(['like.userHasLikedPost', { postId }])
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setIsLiked(data!)
    }
  }, [isLoading, data])

  return [isLiked, setIsLiked]
}
