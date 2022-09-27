import { Context } from '../context'
import * as trpc from '@trpc/server'
import { posts } from './posts'
import { users } from './users'
import { likes } from './likes'
import { dislikes } from './dislikes'
import { comments } from './comments'
import { replies } from './replies'

const createRouter = () => {
  return trpc.router<Context>()
}

export const appRouter = createRouter()
  .merge('post.', posts)
  .merge('user.', users)
  .merge('like.', likes)
  .merge('dislike.', dislikes)
  .merge('comments.', comments)
  .merge('reply.', replies)

export type AppRouter = typeof appRouter