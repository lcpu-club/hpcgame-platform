import Redis from 'ioredis'
import { REDIS_URL } from '../config/index.js'

export const redis = new Redis(REDIS_URL)
