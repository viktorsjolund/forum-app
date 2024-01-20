import { z } from 'zod'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'
import { publicProcedure, router } from '../trpc'

export const searchRouter = router({
  posts: publicProcedure
    .input(
      z.object({
        search: z.string(),
        take: z.number(),
        skip: z.number()
      })
    )
    .query(async ({ input }) => {
      const { search, skip, take } = input

      const formatedSearch = `"${search}"`

      const result = await prisma.post.findMany({
        include: {
          author: true,
          _count: {
            select: {
              comments: true,
              dislikes: true,
              likes: true
            }
          }
        },
        skip,
        take,
        where: {
          title: {
            search: formatedSearch
          },
          content: {
            search: formatedSearch
          }
        },
        orderBy: {
          _relevance: {
            fields: ['title'],
            search: formatedSearch,
            sort: 'asc'
          }
        }
      })

      return result
    }),
  postCount: publicProcedure
    .input(
      z.object({
        search: z.string()
      })
    )
    .query(async ({ input }) => {
      const { search } = input

      const formatedSearch = `"${search}"`

      const result = await prisma.post.count({
        where: {
          title: {
            search: formatedSearch
          },
          content: {
            search: formatedSearch
          }
        }
      })

      return result
    })
})
