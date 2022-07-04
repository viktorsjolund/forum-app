import { Context } from './context'
import * as trpc from '@trpc/server'

/**
 * Helper function to create a router with context
 */
export const createRouter = () => {
  return trpc.router<Context>()
}