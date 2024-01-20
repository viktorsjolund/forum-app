import * as trpcNext from '@trpc/server/adapters/next'
import { createContext } from '@/server/context'
import { postsRouter } from '@/server/routers/posts'
import { usersRouter } from '@/server/routers/users'
import { likesRouter } from '@/server/routers/likes'
import { dislikesRouter } from '@/server/routers/dislikes'
import { commentsRouter } from '@/server/routers/comments'
import { repliesRouter } from '@/server/routers/replies'
import { notificationsRouter } from '@/server/routers/notifications'
import { searchRouter } from '@/server/routers/search'
import { router } from '@/server/trpc'

const appRouter = router({
  post: postsRouter,
  user: usersRouter,
  like: likesRouter,
  dislike: dislikesRouter,
  comments: commentsRouter,
  reply: repliesRouter,
  notification: notificationsRouter,
  search: searchRouter
})

export type AppRouter = typeof appRouter

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      console.error('Something went wrong', error)
    }
  },
  batching: {
    enabled: true
  }
})
