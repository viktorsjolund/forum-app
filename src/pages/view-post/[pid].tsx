import Header from '@/components/header'
import { trpc } from '@/utils/trpc'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { ThumbUpOffAlt, ThumbUpAlt, ThumbDownOffAlt, ThumbDownAlt } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { Comments } from '@/components/post/comments'
import { grey800 } from '@/utils/colors'

const Post = () => {
  const router = useRouter()
  const { pid } = router.query
  const postId = Array.isArray(pid) ? parseInt(pid[0]) : parseInt(pid!)

  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)

  const {
    data: isLikedData,
    isLoading: isLikedLoading,
    error: isLikedError,
  } = trpc.useQuery(['like.userHasLikedPost', { postId }])
  const {
    data: isDislikedData,
    isLoading: isDislikedLoading,
    error: isDislikedError,
  } = trpc.useQuery(['dislike.userHasDislikedPost', { postId }])
  const { data: likesData, isLoading: likesLoading } = trpc.useQuery([
    'like.totalCountByPostId',
    { postId },
  ])
  const { data: dislikesData, isLoading: dislikesLoading } = trpc.useQuery([
    'dislike.totalCountByPostId',
    { postId },
  ])

  useEffect(() => {
    if (isLikedError || isDislikedError) {
      if (
        isLikedError?.data?.code === 'UNAUTHORIZED' ||
        isDislikedError?.data?.code === 'UNAUTHORIZED'
      ) {
        router.push('/account/login')
      }
    }
    if (!isLikedLoading && !isDislikedLoading) {
      setIsLiked(isLikedData!)
      setIsDisliked(isDislikedData!)
    }

    if (!likesLoading && !dislikesLoading) {
      setLikes(likesData!)
      setDislikes(dislikesData!)
    }
  }, [
    isLikedData,
    isDislikedData,
    isLikedLoading,
    isDislikedLoading,
    likesData,
    dislikesData,
    likesLoading,
    dislikesLoading,
    isDislikedError,
    isLikedError,
    router,
  ])

  const { data: post, refetch } = trpc.useQuery(['post.byId', { id: postId }])

  const addLike = trpc.useMutation(['like.add'])
  const removeLike = trpc.useMutation(['like.remove'])
  const addDislike = trpc.useMutation(['dislike.add'])
  const removeDislike = trpc.useMutation(['dislike.remove'])

  if (!post) {
    return <div>Loading...</div>
  }

  const handleAddLike = async () => {
    setLikes(likes + 1)
    if (isDisliked) {
      setDislikes(dislikes - 1)
    }
    setIsDisliked(false)
    setIsLiked(true)
    await removeDislike.mutateAsync({
      postId,
    })
    await addLike.mutateAsync({
      postId,
    })
  }

  const handleAddDislike = async () => {
    setDislikes(dislikes + 1)
    if (isLiked) {
      setLikes(likes - 1)
    }
    setIsDisliked(true)
    setIsLiked(false)
    await removeLike.mutateAsync({
      postId,
    })
    await addDislike.mutateAsync({
      postId,
    })
  }

  const handleRemoveDislike = async () => {
    setDislikes(dislikes - 1)
    setIsDisliked(false)
    await removeDislike.mutateAsync({
      postId,
    })
  }

  const handleRemoveLike = async () => {
    setLikes(likes - 1)
    setIsLiked(false)
    await removeLike.mutateAsync({
      postId,
    })
  }

  const refetchPost = async () => {
    await refetch()
  }

  return (
    <>
      <Header />
      <Box display='flex' justifyContent='center' height='max-content'>
        <Box width='80%' bgcolor={grey800} p={10} height='100%'>
          <Typography
            variant='h2'
            component='h1'
            color='white'
            gutterBottom
          >
            {post.title}
          </Typography>
          <Typography
            paragraph
            width='60%'
          >
            {post.content}
          </Typography>
          <Typography>{post.created_at.toString()}</Typography>
          <Typography>{post.updated_at.toString()}</Typography>
          <Typography>{post.author.username}</Typography>
          <Box
            display='flex'
            sx={{ svg: { cursor: 'pointer' } }}
          >
            <Box display='flex'>
              <Typography>{likes}</Typography>
              {isLiked ? (
                <ThumbUpAlt onClick={handleRemoveLike} />
              ) : (
                <ThumbUpOffAlt onClick={handleAddLike} />
              )}
            </Box>
            <Box display='flex'>
              {isDisliked ? (
                <ThumbDownAlt onClick={handleRemoveDislike} />
              ) : (
                <ThumbDownOffAlt onClick={handleAddDislike} />
              )}
              <Typography>{dislikes}</Typography>
            </Box>
          </Box>
          <Comments
            comments={post.comments}
            postId={post.id}
            refetchPost={refetchPost}
          />
        </Box>
      </Box>
    </>
  )
}

export default Post
