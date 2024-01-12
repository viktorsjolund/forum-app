import { z } from 'zod'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'

export const search = createRouter()
  .query('posts', {
    input: z.object({
      search: z.string(),
      take: z.number(),
      skip: z.number()
    }),
    async resolve({ input }) {
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
    }
  })
  .query('postCount', {
    input: z.object({
      search: z.string()
    }),
    async resolve({ input }) {
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
    }
  })
