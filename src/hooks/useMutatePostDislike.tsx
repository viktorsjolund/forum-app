import { trpc } from '@/utils/trpc'

export const useMutatePostDislike = (postId: number): [() => Promise<void>, () => Promise<void>] => {
  const addDislikeMutation = trpc.useMutation(['dislike.add'])
  const removeDislikeMutation = trpc.useMutation(['dislike.remove'])

  const addDislike = async () => {
    await addDislikeMutation.mutateAsync({
      postId
    })
  }

  const removeDislike = async () => {
    await removeDislikeMutation.mutateAsync({
      postId
    })
  }

  return [addDislike, removeDislike]
}
