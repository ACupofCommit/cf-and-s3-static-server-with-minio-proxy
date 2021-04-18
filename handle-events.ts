import {Client} from 'minio'
import AWS from 'aws-sdk'
import { getType } from 'mime'

const SOURCE_BUCKET_NAME = process.env.SOURCE_BUCKET_NAME
const TARGET_BUCKET_NAME = process.env.TARGET_BUCKET_NAME
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT
const MINIO_PORT = process.env.MINIO_PORT

const minioClient = new Client({
  endPoint: MINIO_ENDPOINT,
  port: Number(MINIO_PORT),
  useSSL: false,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
})

const eventsToListen = ['s3:ObjectCreated:*','s3:ObjectRemoved:*']
const listener = minioClient.listenBucketNotification(SOURCE_BUCKET_NAME, '', '*', eventsToListen)
listener.on('notification', async function(record) {
  // For example: 's3:ObjectCreated:Put event occurred (2016-08-23T18:26:07.214Z)'
  console.log(`${new Date().toISOString()} ${record.eventName} event occurred (${record.eventTime})`)
  console.log(`${new Date().toISOString()} Bucket: ${record.s3.bucket.name}, Key: ${record.s3.object.key} (size: ${record.s3.object.size})`)
  const s3 = new AWS.S3()

  if (/^s3:ObjectCreated:/.test(record.eventName)) {
    const stream = await minioClient.getObject(SOURCE_BUCKET_NAME, record.s3.object.key)
    const contentType = getType(record.s3.object.key)
    const uploadParams: AWS.S3.Types.PutObjectRequest = {
      Bucket: TARGET_BUCKET_NAME,
      Key: record.s3.object.key,
      Body: stream,
      ContentType: contentType,
      CacheControl: contentType === 'text/html'
      ? 'no-store'
      : 'public,max-age=180',
    }
    await s3.upload(uploadParams).promise()
  } else if (record.eventName === 's3:ObjectRemoved:Delete') {
    const params: AWS.S3.Types.DeleteObjectRequest = {
      Bucket: TARGET_BUCKET_NAME,
      Key: record.s3.object.key,
    }
    await s3.deleteObject(params).promise()
  }
  console.log(`${new Date().toISOString()} Done - Bucket: ${record.s3.bucket.name}, Key: ${record.s3.object.key} (size: ${record.s3.object.size})`)
})

console.log(`${new Date().toISOString()} hello!`)
