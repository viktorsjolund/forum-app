import { decodeJwtToken } from '@/utils/decodeJwtToken'
import * as trpc from '@trpc/server'
import { NextApiRequest, NextApiResponse } from 'next'

interface UserToken {
  id: string
}

// The app's context - is generated for each incoming request
export async function createContext({ req, res }: { req: NextApiRequest; res: NextApiResponse }) {
  function getUserFromHeader() {
    const token = req.cookies.token

    if (token) {
      try {
        return decodeJwtToken<UserToken>(token)
      } catch (e) {
        return null
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
