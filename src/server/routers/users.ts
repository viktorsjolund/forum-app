import { z } from 'zod'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'
import bcrypt from 'bcrypt'

export const users = createRouter()
  .mutation('register', {
    input: z.object({
      email: z.string(),
      username: z.string(),
      password: z.string(),
    }),
    async resolve({ input }) {
      const saltRounds = 10
      const hashedPw = await bcrypt.hash(input.password, saltRounds)

      await prisma.forum_user.create({
        data: {
          email: input.email,
          username: input.username,
          password: hashedPw,
        },
      })
    },
  })
