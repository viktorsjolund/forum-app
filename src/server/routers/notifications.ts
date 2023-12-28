import { z } from 'zod'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'
import { notification_trigger } from '@prisma/client'

type TNotificationInput = {
  trigger: notification_trigger
  user_id: number
  post_id: number
  element_id?: string
  initiator_id: number
}

export const notifications = createRouter()
  .mutation('add', {
    input: z.object({
      postId: z.number(),
      trigger: z.nativeEnum(notification_trigger),
      elementId: z.string().optional()
    }),
    async resolve({ input, ctx }) {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED'
        })
      }
      const { postId, trigger, elementId } = input

      const followers = await prisma.post_follow.findMany({
        where: {
          post_id: postId
        }
      })

      const data: TNotificationInput[] = []

      for (const follower of followers) {
        data.push({
          post_id: postId,
          trigger,
          user_id: follower.user_id,
          element_id: elementId,
          initiator_id: parseInt(ctx.user.id)
        })
      }

      await prisma.notification.createMany({
        data
      })
    }
  })
  .query('byUser', {
    async resolve({ ctx }) {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED'
        })
      }

      const result = await prisma.notification.findMany({
        where: {
          user_id: parseInt(ctx.user.id),
          viewed: false
        },
        include: {
          post: true,
          user: true
        },
        orderBy: {
          created_at: 'desc'
        }
        // TODO: ignore getting the logged in user's own comments etc
      })

      return result
    }
  })
  .mutation('viewed', {
    input: z.object({
      notificationId: z.number()
    }),
    async resolve({ input }) {
      const { notificationId } = input

      await prisma.notification.update({
        data: {
          viewed: true
        },
        where: {
          id: notificationId
        }
      })
    }
  })
