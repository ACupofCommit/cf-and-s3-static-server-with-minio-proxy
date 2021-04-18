
variable "namespace" {}
variable "stage" {}
variable "name" {}
variable "mininum_protocol_version" {
  default = "TLSv1"
}

module "cdn" {
  source = "cloudposse/cloudfront-s3-cdn/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  namespace         = var.namespace
  stage             = var.stage
  name              = var.name

  default_ttl	             = 0
  minimum_protocol_version = var.mininum_protocol_version
}

resource "aws_s3_bucket_public_access_block" "origin" {
  bucket                  = module.cdn.s3_bucket
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

output "s3_bucket" {
  value = module.cdn.s3_bucket
}
output "s3_bucket_domain_name" {
  value = module.cdn.s3_bucket_domain_name
}
output "cf_domain_name" {
  value = module.cdn.cf_domain_name
}

output "output" {
  description = "Resource information for accessing elasticsearch"
  value       = <<EOT
# Belows are used by lambda
export TARGET_BUCKET_NAME=${module.cdn.s3_bucket}
EOT
}
