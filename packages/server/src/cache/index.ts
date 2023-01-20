import Redis from 'ioredis'
import { REDIS_URL, REDIS_PREFIX } from '../config/index.js'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: ioredis types are broken
export const redis = new Redis.default(REDIS_URL, { keyPrefix: REDIS_PREFIX })
