import { Context } from '../context'
import * as trpc from '@trpc/server'
import { posts } from './posts'
import { users } from './users'
import { likes } from './likes'
import { dislikes } from './dislikes'
import { comments } from './comments'
import { replies } from './replies'
import { news } from './news'

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
  .merge('news.', news)

export type AppRouter = typeof appRouter