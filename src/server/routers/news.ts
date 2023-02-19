import { z } from 'zod'
import { createRouter } from '../createRouter'
import { prisma } from '../prisma'
import * as trpc from '@trpc/server'
import axios from 'axios'

export const news = createRouter()
  .query('latest', {
    async resolve() {
      const result = await (await axios.get('https://api.spacexdata.com/v5/launches/latest')).data

      return result
    }
  })