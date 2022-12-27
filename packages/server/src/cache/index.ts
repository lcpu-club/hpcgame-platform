import { createClient } from 'redis'
import { REDIS_URL } from '../config/index.js'

export const redis = createClient({
  url: REDIS_URL
})

await redis.connect()
