# cf-and-s3-static-server-with-minio-proxy
It provides a static server as a AWS Cloudfront and S3,
and a proxy server as a local [minio](https://min.io/) server.

## Why?
It is used in an environment where there is no direct access to s3.
For example, if only one host in the corporate network can access s3,
a minio server is launched on this host, allowing other hosts
to access s3 through this minio server.

## Usage
Deploy to AWS Cloudfront and S3.

```
$ terraform apply
```

## Environments

```
export AWS_ACCESS_KEY_ID=AKXXXXXXXXXXXXXXXX4S
export AWS_SECRET_ACCESS_KEY=joxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxJd
export AWS_DEFAULT_REGION=ap-northeast-1

export MINIO_ACCESS_KEY=minioproxy
export MINIO_SECRET_KEY=minioproxy123
export SOURCE_BUCKET_NAME=study           # You should create and use a bucket in minio with this name,

# S3 bucket name to be synced.
# It can be obtained from the output values after terraform apply.
export TARGET_BUCKET_NAME=s3_bucket_name  
```

## Run minio
After setting the environment variable,
execute the minio and `handle-events.ts` with docker-compose.

```
$ docker-compose up -d
```
