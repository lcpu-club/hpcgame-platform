const PREFIX = 'HPC_'

function transformer<T>(transform: (val: string) => T) {
  return (key: string, init?: T) => {
    key = PREFIX + key
    const raw = process.env[key]
    let value: T | undefined = init
    if (typeof raw === 'string') {
      value = transform(raw)
    }
    if (value === undefined)
      throw new Error(`Missing environment variable: ${key}`)
    return value
  }
}
const string = transformer((val) => val)
const number = transformer((val) => parseInt(val, 10))
const boolean = transformer((val) => val === 'true')
const json = transformer((val) => JSON.parse(val))

// MongoDB
export const MONGO_URI = string('MONGO_URI', 'mongodb://localhost:27017/hpc')

// Fastify
export const API_HOST = string('API_HOST', 'localhost')
export const API_PORT = number('API_PORT', 10721)
export const TRUST_PROXY = json('TRUST_PROXY', false) // boolean | string | string[] | number
export const ENABLE_CORS = boolean('ENABLE_CORS', false)

// NSQ
export const NSQ_NSQD_HOST = string('NSQ_NSQD_HOST', 'localhost')
export const NSQ_NSQD_PORT = number('NSQ_NSQD_PORT', 4150)
export const NSQ_LOOKUPD_ADDR = string('NSQ_LOOKUPD_ADDR', '127.0.0.1:4161')

// Minio
export const MINIO_ENDPOINT = string('MINIO_ENDPOINT', 'localhost:9000')
export const MINIO_ACCESS_KEY = string('MINIO_ACCESS_KEY')
export const MINIO_SECRET_KEY = string('MINIO_SECRET_KEY')
export const MINIO_BUCKET = string('MINIO_BUCKET', 'hpc')

// Application
export const DEV_MODE = boolean('DEV_MODE', false)
