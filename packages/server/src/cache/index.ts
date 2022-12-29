import Redis from 'ioredis'
import { REDIS_URL } from '../config/index.js'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: ioredis types are broken
export const redis = new Redis.default(REDIS_URL)
