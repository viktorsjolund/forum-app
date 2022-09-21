import { z } from 'zod'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'
import bcrypt from 'bcrypt'
import * as trpc from '@trpc/server';
import { Prisma } from '@prisma/client';

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

      try {
        await prisma.forum_user.create({
          data: {
            email: input.email,
            username: input.username,
            password: hashedPw,
          },
        })
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // Unique constraint failed on the {constraint} https://www.prisma.io/docs/reference/api-reference/error-reference.
          if (e.code === 'P2002') {
            throw new trpc.TRPCError({
              code: 'BAD_REQUEST',
              message: 'Username and email must be unique.'
            })
          } else {
            throw new trpc.TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Something went wrong...'
            })
          }
        }
      }
    },
  })
