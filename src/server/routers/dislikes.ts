import { z } from 'zod'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'

export const dislikes = createRouter()
  .mutation('add', {
    input: z.object({
      postId: z.number(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
        })
      }
      const { postId } = input

      const result = await prisma.post_dislike.findFirst({
        where: {
          user_id: parseInt(ctx.user!.id),
          post_id: postId,
        },
      })

      if (!result) {
        try {
          await prisma.post_dislike.create({
            data: {
              post_id: postId,
              user_id: parseInt(ctx.user!.id),
            },
          })

          return true
        } catch (e) {
          throw new trpc.TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong...',
          })
        }
      } else {
        return false
      }
    },
  })
  .mutation('remove', {
    input: z.object({
      postId: z.number(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
        })
      }
      const { postId } = input

      try {
        await prisma.post_dislike.deleteMany({
          where: {
            user_id: parseInt(ctx.user!.id),
            post_id: postId,
          },
        })

        return true
      } catch (e) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong...',
        })
      }
    },
  })
  .query('userHasDislikedPost', {
    input: z.object({
      postId: z.number(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
        })
      }
      const { postId } = input

      try {
        const result = await prisma.post_dislike.findFirst({
          where: {
            post_id: postId,
            user_id: parseInt(ctx.user!.id),
          },
        })

        if (result) {
          return true
        } else {
          return false
        }
      } catch (e) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
        })
      }
    },
  })
