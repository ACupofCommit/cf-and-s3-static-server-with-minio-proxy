

module "cdn" {
  source = "cloudposse/cloudfront-s3-cdn/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  namespace         = "cdn1028312093"
  stage             = "prod"
  name              = "app"

  default_ttl	      = 0
  minimum_protocol_version	 = "TLSv1.2_2019"
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