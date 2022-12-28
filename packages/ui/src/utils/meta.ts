import { version } from '@/../package.json'

export { version }

export const hash = import.meta.env.VITE_GIT_HASH
export const buildTime = import.meta.env.VITE_BUILD_TIME
