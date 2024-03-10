import { z } from 'zod'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'
import { publicProcedure, router } from '../trpc'

export const repliesRouter = router({
  add: publicProcedure
    .input(
      z.object({
        content: z.string(),
        commentId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
        })
      }

      const { content, commentId } = input

      try {
        await prisma.post_reply.create({
          data: {
            content,
            comment_id: commentId,
            user_id: ctx.user.id,
          },
        })
      } catch (e) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
        })
      }
    }),
})
