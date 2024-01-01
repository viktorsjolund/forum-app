import { z } from 'zod'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'

export const posts = createRouter()
  .query('byId', {
    input: z.object({
      id: z.number()
    }),
    async resolve({ input }) {
      const post = await prisma.post.findFirst({
        where: {
          id: input.id
        },
        include: {
          author: true,
          likes: true,
          dislikes: true,
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
    }
  })
  .query('all', {
    async resolve() {
      return await prisma.post.findMany({})
    }
  })
  .query('allByLikes', {
    input: z.object({
      skip: z.number(),
      take: z.number()
    }),
    async resolve({ input }) {
      const { skip, take } = input

      const result = await prisma.post.findMany({
        orderBy: {
          likes: {
            _count: 'asc'
          }
        },
        skip,
        take,
        include: {
          likes: true,
          dislikes: true,
          author: true,
          comments: true
        }
      })

      return result
    }
  })
  .query('byUser', {
    input: z.object({
      userId: z.number()
    }),
    async resolve({ input }) {
      const { userId } = input

      const result = await prisma.post.findMany({
        where: {
          authorId: userId
        },
        include: {
          likes: true,
          dislikes: true,
          author: true,
          comments: true
        }
      })

      return result
    }
  })
  .query('byUserLikes', {
    input: z.object({
      userId: z.number()
    }),
    async resolve({ input }) {
      const { userId } = input

      const result = await prisma.post.findMany({
        where: {
          likes: {
            some: {
              user_id: userId
            }
          }
        },
        include: {
          likes: true,
          dislikes: true,
          author: true,
          comments: true
        }
      })

      return result
    }
  })
  .mutation('add', {
    input: z.object({
      title: z.string(),
      content: z.string(),
      topic: z.string()
    }),
    async resolve({ input, ctx }) {
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
    }
  })
  .query('byTopic', {
    input: z.object({
      topic: z.string()
    }),
    async resolve({ input }) {
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
    }
  })
  .mutation('remove', {
    input: z.object({
      id: z.number()
    }),
    async resolve({ input, ctx }) {
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
    }
  })
  .mutation('follow', {
    input: z.object({
      postId: z.number()
    }),
    async resolve({ input, ctx }) {
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
    }
  })
  .mutation('unfollow', {
    input: z.object({
      postId: z.number()
    }),
    async resolve({ input, ctx }) {
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
    }
  })
  .query('isFollowed', {
    input: z.object({
      postId: z.number()
    }),
    async resolve({ input, ctx }) {
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
    }
  })
  .query('isAuthor', {
    input: z.object({
      postId: z.number()
    }),
    async resolve({ input, ctx }) {
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
    }
  })
  .mutation('update', {
    input: z.object({
      postId: z.number(),
      title: z.string().optional(),
      topic: z.string().optional(),
      content: z.string().optional()
    }),
    async resolve({ input }) {
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
    }
  })
