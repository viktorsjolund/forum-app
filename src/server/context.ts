import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import * as trpc from '@trpc/server'
import { getServerAuthSession } from '@/pages/api/auth';
import { Session } from 'next-auth';

// The app's context - is generated for each incoming request
export async function createContext(opts: CreateNextContextOptions) {
  const { req, res } = opts

  const session = await getServerAuthSession({ req, res })

  return {
    user: session?.user as Session['user'] & { id: string } | undefined,
    res,
    req,
  }
}
export type Context = trpc.inferAsyncReturnType<typeof createContext>
