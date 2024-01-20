import { decodeJwtToken } from '@/utils/decodeJwtToken'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import * as trpc from '@trpc/server'

interface UserToken {
  id: string
}

// The app's context - is generated for each incoming request
export async function createContext(opts: CreateNextContextOptions) {
  const { req, res } = opts

  function getUserFromHeader() {
    const token = req.cookies.token

    if (token) {
      try {
        return decodeJwtToken<UserToken>(token)
      } catch (e) {
        throw e
      }
    }

    return null
  }

  const user = getUserFromHeader()

  return {
    user,
    res,
    req,
  }
}
export type Context = trpc.inferAsyncReturnType<typeof createContext>
