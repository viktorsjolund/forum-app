import { z } from 'zod'
import { createRouter } from '../createRouter'

export const posts = createRouter()
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      return `Post with id ${input.id}`
    },
  })
