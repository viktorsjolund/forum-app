import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import jwt from 'jsonwebtoken'

// The app's context - is generated for each incoming request
export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers

  // This is just an example of something you'd might want to do in your ctx fn
  async function getUserFromHeader() {
    if (opts?.req.headers.cookie) {
      const user = jwt.verify(opts.req.headers.cookie, process.env.JWT_SECRET!)
      return user as { id: string }
    }
    return null
  }
  const user = await getUserFromHeader()

  return {
    user,
    res: opts?.res,
  }
}
export type Context = trpc.inferAsyncReturnType<typeof createContext>
