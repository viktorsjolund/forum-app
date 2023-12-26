import type { user } from '@prisma/client'

export type Me = Omit<user, 'password'>
