import { trpc } from '@/utils/trpc'

export const useMutatePostLike = (postId: number): [() => Promise<void>, () => Promise<void>] => {
  const addLikeMutation = trpc.useMutation(['like.add'])
  const removeLikeMutation = trpc.useMutation(['like.remove'])

  const addLike = async () => {
    await addLikeMutation.mutateAsync({
      postId
    })
  }

  const removeLike = async () => {
    await removeLikeMutation.mutateAsync({
      postId
    })
  }

  return [addLike, removeLike]
}
