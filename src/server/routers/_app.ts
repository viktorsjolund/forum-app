import { Context } from '../context'
import * as trpc from '@trpc/server'
import { posts } from './posts'
import { users } from './users'
import { likes } from './likes'

const createRouter = () => {
  return trpc.router<Context>()
}

export const appRouter = createRouter()
  .merge('post.', posts)
  .merge('user.', users)
  .merge('like.', likes)

export type AppRouter = typeof appRouter