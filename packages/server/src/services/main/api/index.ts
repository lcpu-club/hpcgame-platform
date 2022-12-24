import { authRouter } from './auth.js'
import { rootChain } from './base.js'
import { userRouter } from './user.js'

export const rootRouter = rootChain
  .router()
  .route('/auth', authRouter)
  .route('/user', userRouter)
