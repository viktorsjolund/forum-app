import { z } from 'zod'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'
import { Prisma } from '@prisma/client'
import jwt from 'jsonwebtoken'
import argon2 from 'argon2'
import { serialize } from 'cookie'

export const users = createRouter()
  .mutation('register', {
    input: z.object({
      email: z.string(),
      username: z.string(),
      password: z.string(),
    }),
    async resolve({ input }) {
      const hashedPw = await argon2.hash(input.password)

      try {
        await prisma.user.create({
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
              message: 'Username and email must be unique.',
            })
          } else {
            throw new trpc.TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Something went wrong...',
            })
          }
        }
      }
    },
  })
  .mutation('login', {
    input: z.object({
      email: z.string(),
      password: z.string(),
    }),
    async resolve({ input, ctx }) {
      const user = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      })

      if (!user) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: 'Email does not exist.',
        })
      }

      const isPasswordValid = await argon2.verify(user.password, input.password)
      if (!isPasswordValid) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid password.',
        })
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '240h' })
      
      ctx.res.setHeader('Set-Cookie',  serialize('token', token, { path: '/' }))
    },
  })
  .query('byUsername', {
    input: z.object({
      username: z.string()
    }),
    async resolve({ input }) {
      const { username } = input

      const user = await prisma.user.findUnique({
        where: {
          username
        }
      })

      if (!user) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND'
        })
      }

      return user
    }
  })
  .query('me', {
    async resolve({ ctx }) {
      if (!ctx.user) {
        return null
      }

      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(ctx.user.id)
        }
      })
      
      return user
    }
  })
  .query('isAuthorized', {
    resolve({ ctx }) {
      if (ctx.user) {
        return true
      } else {
        return false
      }
    }
  })
  .mutation('logout', {
    async resolve({ ctx }) {
      ctx.res.setHeader('Set-Cookie',  serialize('token', '', { maxAge: -1, path: '/' }))
    }
  })
