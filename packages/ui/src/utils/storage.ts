export const PREFIX = import.meta.env.VITE_STORAGE_PREFIX || 'app'

export function getItem(key: string) {
  return localStorage.getItem(PREFIX + key)
}

export function setItem(key: string, value: string) {
  return localStorage.setItem(PREFIX + key, value)
}
