import { trpc } from '@/utils/trpc'
import { useEffect, useState } from 'react'

export const usePostFollow = (postId: number): [() => Promise<void>, boolean] => {
  const { data: isFollowedData } = trpc.useQuery(['post.isFollowed', { postId }])
  const followPostMutation = trpc.useMutation(['post.follow'])
  const unfollowPostMutation = trpc.useMutation(['post.unfollow'])
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
          postId
        })
      } catch (e) {
        setIsFollowed(true)
      }
    } else {
      setIsFollowed(true)

      try {
        await followPostMutation.mutateAsync({
          postId
        })
      } catch (e) {
        setIsFollowed(false)
      }
    }
  }

  return [handleFollow, isFollowed]
}
