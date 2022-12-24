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

export const MONGO_URI = string('MONGO_URI', 'mongodb://localhost:27017/hpc')
export const API_HOST = string('API_HOST', 'localhost')
export const API_PORT = number('API_PORT', 10721)
export const TRUST_PROXY = json('TRUST_PROXY', false) // boolean | string | string[] | number
export const ENABLE_CORS = boolean('ENABLE_CORS', false)
export const NSQ_HOST = string('NSQ_HOST', 'localhost')
export const NSQ_PORT = number('NSQ_PORT', 4150)
export const NSQ_LOOKUPD_ADDR = string('NSQ_LOOKUPD_URL', '127.0.0.1:4161')
export const DEV_MODE = boolean('DEV_MODE', false)
