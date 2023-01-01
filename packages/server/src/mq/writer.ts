import { createWriter } from './index.js'

export const writer = await createWriter()
export function publishAsync(topic: string, value: unknown) {
  return new Promise<void>((resolve, reject) => {
    writer.publish(topic, JSON.stringify(value), (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}
