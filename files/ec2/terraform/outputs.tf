output "db_endpoint" {
  value = aws_db_instance.db.endpoint
}

output "db_name" {
  value = aws_db_instance.db.db_name
}

output "db_user" {
  value = aws_db_instance.db.username
}

output "db_password" {
  value = aws_db_instance.db.password
}

output "alb_dns" {
  value = aws_lb.app_alb.dns_name
}

output "ec2_public_ip" {
  value = aws_instance.app.public_ip
}

output "cloudfront_url" {
  value = aws_cloudfront_distribution.cdn.domain_name
}

output "cloudfront_id" {
  value = aws_cloudfront_distribution.cdn.id
}

output "s3_bucket_name" {
  value = aws_s3_bucket.frontend.bucket
}
