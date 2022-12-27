import { authRouter } from './auth.js'
import { rootChain } from './base.js'
import { kvRouter } from './kv.js'
import { problemRouter } from './problem.js'
import { submissionRouter } from './submission.js'
import { userRouter } from './user.js'

export const rootRouter = rootChain
  .router()
  .route('/auth', authRouter)
  .route('/kv', kvRouter)
  .route('/user', userRouter)
  .route('/problem', problemRouter)
  .route('/submission', submissionRouter)
