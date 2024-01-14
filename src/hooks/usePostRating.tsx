import { trpc } from '@/utils/trpc'
import { useEffect, useState } from 'react'

export const usePostRating = (
  postId: number
): [() => Promise<void>, () => Promise<void>, boolean, boolean] => {
  const addLikeMutation = trpc.useMutation(['like.add'])
  const removeLikeMutation = trpc.useMutation(['like.remove'])
  const addDislikeMutation = trpc.useMutation(['dislike.add'])
  const removeDislikeMutation = trpc.useMutation(['dislike.remove'])
  const { data: isLikedData } = trpc.useQuery(['like.userHasLikedPost', { postId }])
  const { data: isDislikedData } = trpc.useQuery(['dislike.userHasDislikedPost', { postId }])
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  useEffect(() => {
    if (typeof isLikedData !== 'undefined') {
      setIsLiked(isLikedData)
    }

    if (typeof isDislikedData !== 'undefined') {
      setIsDisliked(isDislikedData)
    }
  }, [isLikedData, isDislikedData])

  const handleLike = async () => {
    if (isLiked) {
      setIsLiked(false)

      try {
        await removeLikeMutation.mutateAsync({
          postId
        })
      } catch (e) {
        setIsLiked(true)
      }
    } else {
      setIsDisliked(false)
      setIsLiked(true)

      try {
        await addLikeMutation.mutateAsync({
          postId
        })
      } catch (e) {
        setIsLiked(false)
        setIsDisliked(isDisliked)
        return
      }

      if (isDisliked) {
        try {
          await removeDislikeMutation.mutateAsync({
            postId
          })
        } catch (e) {
          setIsDisliked(true)
        }
      }
    }
  }

  const handleDislike = async () => {
    if (isDisliked) {
      setIsDisliked(false)

      try {
        await removeDislikeMutation.mutateAsync({
          postId
        })
      } catch (e) {
        setIsDisliked(true)
      }
    } else {
      setIsLiked(false)
      setIsDisliked(true)

      try {
        await addDislikeMutation.mutateAsync({
          postId
        })
      } catch (e) {
        setIsDisliked(false)
        setIsLiked(isLiked)
        return
      }

      if (isLiked) {
        try {
          await removeLikeMutation.mutateAsync({
            postId
          })
        } catch (e) {
          setIsLiked(true)
        }
      }
    }
  }

  return [handleLike, handleDislike, isLiked, isDisliked]
}
