import { initTRPC } from '@trpc/server'
import { Context } from './context'
import superjson from 'superjson'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape } = opts
    return {
      ...shape,
      data: {
        ...shape.data
      }
    }
  }
})
/**
 * We recommend only exporting the functionality that we
 * use so we can enforce which base procedures should be used
 **/
export const router = t.router
export const publicProcedure = t.procedure
