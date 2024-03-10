import { z } from 'zod'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'
import { publicProcedure, router } from '../trpc'

export const likesRouter = router({
  add: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
        })
      }
      const { postId } = input

      const result = await prisma.post_like.findFirst({
        where: {
          user_id: ctx.user.id,
          post_id: postId,
        },
      })

      if (!result) {
        try {
          await prisma.post_like.create({
            data: {
              post_id: postId,
              user_id: ctx.user.id,
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
    }),
  remove: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
        })
      }
      const { postId } = input

      try {
        await prisma.post_like.deleteMany({
          where: {
            user_id: ctx.user.id,
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
    }),
  userHasLikedPost: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
        })
      }
      const { postId } = input

      try {
        const result = await prisma.post_like.findFirst({
          where: {
            post_id: postId,
            user_id: ctx.user.id,
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
    }),
})
