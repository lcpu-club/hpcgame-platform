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
export const MINIO_BUCKET_SUBMISSION = string(
  'MINIO_BUCKET_SUBMISSION',
  'submission'
)
export const MINIO_BUCKET_PROBLEM = string('MINIO_BUCKET_PROBLEM', 'problem')

// Application
export const DEV_MODE = boolean('DEV_MODE', false)

// Auth
export const IAAA_ID = string('IAAA_ID')
export const IAAA_KEY = string('IAAA_KEY')
export const NEWCOMER_YEAR = string('NEWCOMER_YEAR', '22')

// Mail
export const SMTP_HOST = string('SMTP_HOST')
export const SMTP_PORT = number('SMTP_PORT')
export const SMTP_USER = string('SMTP_USER')
export const SMTP_PASS = string('SMTP_PASS')
export const MAIL_FROM = string('MAIL_FROM')
export const MAIL_SENDER = string('MAIL_SENDER', 'HPC Game System')

// Redis
export const REDIS_URL = string('REDIS_URL', 'redis://localhost:6379')

// Recaptcha
export const RECAPTCHA_SECRET = string('RECAPTCHA_SECRET')

// SCOW
export const SCOW_GRPC_ADDR = string('SCOW_GRPC_ADDR')
export const SCOW_TENANT_NAME = string('SCOW_TENANT_NAME', 'hpcgame')
export const SCOW_ADMIN_NAME = string('SCOW_ADMIN_NAME', 'hpcgame_admin')
export const SCOW_ADMIN_PASS = string('SCOW_ADMIN_PASS', 'hpcgame_admin')

// Runner
export const RUNNER_SECRET = string('RUNNER_SECRET', '')
