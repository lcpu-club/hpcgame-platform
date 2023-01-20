import { adminRouter } from './admin.js'
import { authRouter } from './auth.js'
import { rootChain } from './base.js'
import { kvRouter } from './kv.js'
import { messageRouter } from './message.js'
import { problemRouter } from './problem.js'
import { submissionRouter } from './submission.js'
import { teamRouter } from './team.js'
import { userRouter } from './user.js'

export const rootRouter = rootChain
  .router()
  .route('/auth', authRouter)
  .route('/kv', kvRouter)
  .route('/message', messageRouter)
  .route('/user', userRouter)
  .route('/team', teamRouter)
  .route('/problem', problemRouter)
  .route('/submission', submissionRouter)
  .route('/admin', adminRouter)
