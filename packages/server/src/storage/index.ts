import { S3Client } from '@aws-sdk/client-s3'
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
  forcePathStyle: true
})
