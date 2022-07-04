import { Context } from '../context'
import * as trpc from '@trpc/server'
import { posts } from './posts'

const createRouter = () => {
  return trpc.router<Context>()
}

export const appRouter = createRouter()
  .merge('post.', posts)

export type AppRouter = typeof appRouter