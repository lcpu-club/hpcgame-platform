import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import {
  MINIO_ACCESS_KEY,
  MINIO_ENDPOINT,
  MINIO_SECRET_KEY
} from '../config/index.js'

export const s3 = new S3Client({
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY
  },
  endpoint: MINIO_ENDPOINT,
  forcePathStyle: true,
  region: 'us-east-1'
})

const urlBase = MINIO_ENDPOINT.endsWith('/')
  ? MINIO_ENDPOINT
  : MINIO_ENDPOINT + '/'
const urlBaseLength = urlBase.length

function normalizeUrl(url: string) {
  return url.substring(urlBaseLength)
}

export async function getUploadUrl(
  bucket: string,
  key: string,
  size: number,
  expiresIn = 60
) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentLength: size
  })
  return normalizeUrl(await getSignedUrl(s3, command, { expiresIn }))
}

export async function getDownloadUrl(
  bucket: string,
  key: string,
  expiresIn = 60
) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  })
  return normalizeUrl(await getSignedUrl(s3, command, { expiresIn }))
}
