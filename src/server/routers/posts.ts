import { z } from 'zod'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'

export const posts = createRouter()
  .query('byId', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const post = await prisma.post.findUnique({
        where: {
          id: input.id,
        },
        include: {
          author: true,
          comments: true
        }
      })
      
      return post
    }
  })
  .query('all', {
    async resolve() {
      return await prisma.post.findMany({})
    }
  })
  .mutation('add', {
    input: z.object({
      title: z.string(),
      content: z.string(),
      topic: z.string()
    }),
    async resolve({ input, ctx }) {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED'
        })
      }
      const { title, content, topic } = input

      const result = await prisma.post.create({
        data: {
          title,
          content,
          topic: topic.toLowerCase(),
          authorId: parseInt(ctx.user!.id)
        },
        select: {
          id: true
        }
      })

      return result
    }
  })
