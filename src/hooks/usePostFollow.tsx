import { trpc } from '@/utils/trpc'
import { useEffect, useState } from 'react'

export const usePostFollow = (
  postId: string,
): [() => Promise<void>, boolean] => {
  const { data: isFollowedData } = trpc.post.isFollowed.useQuery({ postId })
  const followPostMutation = trpc.post.follow.useMutation()
  const unfollowPostMutation = trpc.post.unfollow.useMutation()
  const [isFollowed, setIsFollowed] = useState(false)

  useEffect(() => {
    if (typeof isFollowedData !== 'undefined') {
      setIsFollowed(isFollowedData)
    }
  }, [isFollowedData])

  const handleFollow = async () => {
    if (isFollowed) {
      setIsFollowed(false)

      try {
        await unfollowPostMutation.mutateAsync({
          postId,
        })
      } catch (e) {
        setIsFollowed(true)
      }
    } else {
      setIsFollowed(true)

      try {
        await followPostMutation.mutateAsync({
          postId,
        })
      } catch (e) {
        setIsFollowed(false)
      }
    }
  }

  return [handleFollow, isFollowed]
}
