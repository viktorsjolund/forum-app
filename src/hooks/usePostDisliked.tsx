import { trpc } from '@/utils/trpc'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export const usePostDisliked = (postId: number): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const { data, isLoading } = trpc.useQuery(['dislike.userHasDislikedPost', { postId }])
  const [isDisliked, setIsDisliked] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setIsDisliked(data!)
    }
  }, [isLoading, data])

  return [isDisliked, setIsDisliked]
}
