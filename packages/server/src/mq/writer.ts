import { createWriter } from './index.js'

export const writer = await createWriter()
export function publishAsync<T>(topic: string, value: T) {
  return new Promise<void>((resolve, reject) => {
    writer.publish(topic, JSON.stringify(value), (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}
