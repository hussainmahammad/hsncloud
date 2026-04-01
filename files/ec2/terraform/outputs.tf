output "alb_dns" {
  value = aws_lb.app_alb.dns_name
}

output "cloudfront_url" {
  value = aws_cloudfront_distribution.cdn.domain_name
}

output "ec2_public_ip" {
  value = aws_instance.app.public_ip
}
