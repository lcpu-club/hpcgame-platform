import { protectedChain } from './base.js'

export const submissionRouter = protectedChain
  .router()
  // List submissions
  .handle('GET', '/list', (C) => C.handler())
  // Get a submission
  .handle('GET', '/', (C) => C.handler())
  // Create a submission
  .handle('POST', '/', (C) => C.handler())
  // Update a submission
  .handle('PATCH', '/', (C) => C.handler())
  // Delete a submission
  .handle('DELETE', '/', (C) => C.handler())
  .handle('POST', '/count', (C) => C.handler())
  .handle('POST', '/search', (C) => C.handler())
