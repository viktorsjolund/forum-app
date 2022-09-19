import { z } from 'zod'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'

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
      })

      return {
        id: post?.id,
        title: post?.title,
        description: post?.description,
        createdAt: post?.createdAt,
        updatedAt: post?.updatedAt,
      }
    }
  })
  .query('all', {
    async resolve() {
      return await prisma.post.findMany({})
    }
  })
