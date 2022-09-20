import { z } from 'zod'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'

export const posts = createRouter()
  .query('byId', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const post = await prisma.forum_post.findUnique({
        where: {
          id: input.id,
        },
        include: {
          author: true
        }
      })
      
      return post
    }
  })
  .query('all', {
    async resolve() {
      return await prisma.forum_post.findMany({})
    }
  })
