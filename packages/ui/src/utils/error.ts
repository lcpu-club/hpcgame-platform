import { HandlerFetchError } from 'typeful-fetch'

export async function getErrorMessage(error: unknown): Promise<string> {
  if (!(error instanceof Error)) return `${error}`
  if (error instanceof HandlerFetchError) {
    try {
      const { message } = await error.response.json()
      return message
    } catch (err) {
      return getErrorMessage(err)
    }
  }
  return error.message
}
