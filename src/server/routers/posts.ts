import { z } from 'zod'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'
import { publicProcedure, router } from '../trpc'

export const postsRouter = router({
  byId: publicProcedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .query(async ({ input }) => {
      const post = await prisma.post.findFirst({
        where: {
          id: input.id
        },
        include: {
          author: true,
          _count: {
            select: {
              dislikes: true,
              likes: true
            }
          },
          comments: {
            orderBy: {
              created_at: 'asc'
            },
            include: {
              author: true,
              replies: {
                orderBy: {
                  created_at: 'desc'
                },
                include: {
                  author: true
                }
              }
            }
          }
        }
      })

      return post
    }),
  all: publicProcedure.query(async () => {
    return await prisma.post.findMany({})
  }),
  allByNew: publicProcedure
    .input(
      z.object({
        skip: z.number(),
        take: z.number()
      })
    )
    .query(async ({ input }) => {
      const { skip, take } = input

      const result = await prisma.post.findMany({
        orderBy: {
          created_at: 'desc'
        },
        skip,
        take,
        include: {
          author: true,
          _count: {
            select: {
              comments: true,
              dislikes: true,
              likes: true
            }
          }
        }
      })

      return result
    }),
  allByLikes: publicProcedure
    .input(
      z.object({
        skip: z.number(),
        take: z.number()
      })
    )
    .query(async ({ input }) => {
      const { skip, take } = input

      const result = await prisma.post.findMany({
        orderBy: {
          likes: {
            _count: 'desc'
          }
        },
        skip,
        take,
        include: {
          author: true,
          _count: {
            select: {
              comments: true,
              dislikes: true,
              likes: true
            }
          }
        }
      })

      return result
    }),
  count: publicProcedure.query(async () => {
    return await prisma.post.count()
  }),
  byUser: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        skip: z.number(),
        take: z.number()
      })
    )
    .query(async ({ input }) => {
      const { userId, skip, take } = input

      const result = await prisma.post.findMany({
        where: {
          authorId: userId
        },
        skip,
        take,
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
        orderBy: {
          created_at: 'desc'
        }
      })

      return result
    }),
  countByUser: publicProcedure
    .input(
      z.object({
        userId: z.number()
      })
    )
    .query(async ({ input }) => {
      const { userId } = input

      const result = await prisma.post.count({
        where: {
          authorId: userId
        }
      })

      return result
    }),
  byUserLikes: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        skip: z.number(),
        take: z.number()
      })
    )
    .query(async ({ input }) => {
      const { userId, skip, take } = input

      const result = await prisma.post.findMany({
        where: {
          likes: {
            some: {
              user_id: userId
            }
          }
        },
        skip,
        take,
        include: {
          author: true,
          _count: {
            select: {
              comments: true,
              dislikes: true,
              likes: true
            }
          }
        }
      })

      return result
    }),
  countByUserLikes: publicProcedure
    .input(
      z.object({
        userId: z.number()
      })
    )
    .query(async ({ input }) => {
      const { userId } = input

      const result = await prisma.post.count({
        where: {
          likes: {
            some: {
              user_id: userId
            }
          }
        }
      })

      return result
    }),
  add: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        topic: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED'
        })
      }
      const { title, content, topic } = input

      const filteredTopics = topic.split(',').filter(String).join(',').toLowerCase()

      const result = await prisma.post.create({
        data: {
          title: title.trim(),
          content: content.trim(),
          topic: filteredTopics || undefined,
          authorId: parseInt(ctx.user.id)
        },
        select: {
          id: true
        }
      })

      return result
    }),
  byTopic: publicProcedure
    .input(
      z.object({
        topic: z.string()
      })
    )
    .query(async ({ input }) => {
      const { topic } = input
      const posts = await prisma.post.findMany({
        where: {
          topic: {
            contains: topic
          }
        },
        include: {
          author: true
        }
      })

      return posts
    }),
  remove: publicProcedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED'
        })
      }
      const { id } = input

      try {
        await prisma.post.delete({
          where: {
            id
          }
        })
      } catch (e) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: `Post id ${id} could not be found.`
        })
      }
    }),
  follow: publicProcedure
    .input(
      z.object({
        postId: z.number()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED'
        })
      }
      const { postId } = input

      try {
        await prisma.post_follow.create({
          data: {
            post_id: postId,
            user_id: parseInt(ctx.user.id)
          }
        })
      } catch (e) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST'
        })
      }
    }),
  unfollow: publicProcedure
    .input(
      z.object({
        postId: z.number()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED'
        })
      }
      const { postId } = input

      try {
        await prisma.post_follow.deleteMany({
          where: {
            post_id: postId,
            user_id: parseInt(ctx.user.id)
          }
        })
      } catch (e) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST'
        })
      }
    }),
  isFollowed: publicProcedure
    .input(
      z.object({
        postId: z.number()
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED'
        })
      }
      const { postId } = input

      const result = await prisma.post_follow.findFirst({
        where: {
          post_id: postId,
          user_id: parseInt(ctx.user.id)
        }
      })

      return !!result
    }),
  isAuthor: publicProcedure
    .input(
      z.object({
        postId: z.number()
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED'
        })
      }

      const { postId } = input

      const result = await prisma.post.findFirst({
        where: {
          id: postId,
          authorId: parseInt(ctx.user.id)
        }
      })

      return !!result
    }),
  update: publicProcedure
    .input(
      z.object({
        postId: z.number(),
        title: z.string().optional(),
        topic: z.string().optional(),
        content: z.string().optional()
      })
    )
    .mutation(async ({ input }) => {
      const { postId, content, title, topic } = input

      const result = await prisma.post.update({
        where: {
          id: postId
        },
        data: {
          title,
          topic,
          content
        }
      })

      return result
    })
})
