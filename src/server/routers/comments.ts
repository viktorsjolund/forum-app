import { z } from 'zod'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'

export const comments = createRouter()
  .mutation('add', {
    input: z.object({
      content: z.string(),
      postId: z.number()
    }),
    async resolve({ input, ctx }) {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED'
        })
      }

      const { content, postId } = input

      try {
        const result = await prisma.post_comment.create({
          data: {
            content,
            post_id: postId,
            user_id: parseInt(ctx.user.id)
          }
        })

        return result
      } catch (e) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR'
        })
      }
    }
  })