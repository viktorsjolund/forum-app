import { z } from 'zod'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'
import { publicProcedure, router } from '../trpc'

export const dislikesRouter = router({
  add: publicProcedure
    .input(
      z.object({
        postId: z.number()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED'
        })
      }
      const { postId } = input

      const result = await prisma.post_dislike.findFirst({
        where: {
          user_id: ctx.user!.id,
          post_id: postId
        }
      })

      if (!result) {
        try {
          await prisma.post_dislike.create({
            data: {
              post_id: postId,
              user_id: ctx.user.id
            }
          })

          return true
        } catch (e) {
          throw new trpc.TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong...'
          })
        }
      } else {
        return false
      }
    }),
  remove: publicProcedure
    .input(
      z.object({
        postId: z.number()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED'
        })
      }
      const { postId } = input

      try {
        await prisma.post_dislike.deleteMany({
          where: {
            user_id: ctx.user.id,
            post_id: postId
          }
        })

        return true
      } catch (e) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong...'
        })
      }
    }),
  userHasDislikedPost: publicProcedure
    .input(
      z.object({
        postId: z.number()
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED'
        })
      }
      const { postId } = input

      try {
        const result = await prisma.post_dislike.findFirst({
          where: {
            post_id: postId,
            user_id: ctx.user.id
          }
        })

        if (result) {
          return true
        } else {
          return false
        }
      } catch (e) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR'
        })
      }
    })
})
