export function s3url(url: string) {
  return import.meta.env.VITE_MINIO_ENDPOINT + url
}
