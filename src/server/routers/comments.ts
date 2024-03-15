import { z } from 'zod'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'
import { publicProcedure, router } from '../trpc'

export const commentsRouter = router({
  add: publicProcedure
    .input(
      z.object({
        content: z.string(),
        postId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
        })
      }

      const { content, postId } = input

      try {
        const result = await prisma.post_comment.create({
          data: {
            content,
            post_id: postId,
            user_id: ctx.user.id,
          },
        })

        return result
      } catch (e) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
        })
      }
    }),
})
