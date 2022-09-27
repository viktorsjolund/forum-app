import { z } from 'zod'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'

export const replies = createRouter()
  .mutation('add', {
    input: z.object({
      content: z.string(),
      commentId: z.number()
    }),
    async resolve({ input, ctx }) {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED'
        })
      }

      const { content, commentId } = input

      try {
        await prisma.post_reply.create({
          data: {
            content,
            comment_id: commentId,
            user_id: parseInt(ctx.user.id)
          }
        })
      } catch (e) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR'
        })
      }
    }
  })