import md5 from 'crypto-js/md5'

const gravatarUrl = import.meta.env.VITE_GRAVATAR_URL

export function gravatar(email: string, size = 80) {
  if (!email) return ''
  const hash = md5(email.trim().toLowerCase())
  return `${gravatarUrl}${hash}?s=${size}`
}
