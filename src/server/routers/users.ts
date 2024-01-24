import { z } from 'zod'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'
import { Prisma } from '@prisma/client'
import argon2 from 'argon2'
import { serialize } from 'cookie'
import { publicProcedure, router } from '../trpc'
import { getProviders } from 'next-auth/react'
import { exclude } from '@/utils/exclude'

export const usersRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string(),
        username: z.string(),
        password: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const hashedPw = await argon2.hash(input.password)

      try {
        await prisma.user.create({
          data: {
            email: input.email,
            username: input.username,
            password: hashedPw
          }
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
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: input.email
        }
      })

      if (!user) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: 'Email does not exist.'
        })
      }

      const isPasswordValid = await argon2.verify(user.password!, input.password)
      if (!isPasswordValid) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid password.'
        })
      }

      const userWithoutPassword = exclude(user, ['password'])
      return userWithoutPassword
    }),
  byUsername: publicProcedure
    .input(
      z.object({
        username: z.string()
      })
    )
    .query(async ({ input }) => {
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
    }),
  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: {
        id: ctx.user.id
      },
      select: {
        email: true,
        username: true,
        id: true,
        role: true,
        image: true
      }
    })

    return user
  }),
  isAuthorized: publicProcedure.query(({ ctx }) => {
    if (ctx.user) {
      return true
    } else {
      return false
    }
  }),
  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.res.setHeader('Set-Cookie', serialize('token', '', { maxAge: -1, path: '/' }))
  }),
  update: publicProcedure
    .input(
      z.object({
        username: z.string().optional()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { username } = input

      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED'
        })
      }

      try {
        await prisma.user.update({
          where: {
            id: ctx.user.id
          },
          data: {
            username
          }
        })
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // Unique constraint failed on the {constraint} https://www.prisma.io/docs/reference/api-reference/error-reference.
          if (e.code === 'P2002') {
            throw new trpc.TRPCError({
              code: 'BAD_REQUEST',
              message: 'Username already taken.'
            })
          } else {
            throw new trpc.TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Something went wrong...'
            })
          }
        }
      }
    }),
  providers: publicProcedure.query(async () => {
    const providers = await getProviders()

    return providers ?? []
  })
})
