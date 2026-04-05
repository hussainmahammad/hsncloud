resource "aws_cloudfront_distribution" "cdn" {

  # -----------------------------
  # S3 FRONTEND ORIGIN (FIXED)
  # -----------------------------
  origin {
    domain_name = aws_s3_bucket_website_configuration.frontend.website_endpoint
    origin_id   = "s3-origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # -----------------------------
  # ALB BACKEND ORIGIN (FIXED)
  # -----------------------------
  origin {
    domain_name = aws_lb.app_alb.dns_name
    origin_id   = "alb-origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # -----------------------------
  # DEFAULT → FRONTEND
  # -----------------------------
  default_cache_behavior {
    target_origin_id       = "s3-origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  # -----------------------------
  # /api → BACKEND (ALB)
  # -----------------------------
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    target_origin_id = "alb-origin"

    allowed_methods = ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE"]
    cached_methods  = ["GET", "HEAD"]

    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true

      headers = ["*"]

      cookies {
        forward = "all"
      }
    }
  }

  # -----------------------------
  # GENERAL SETTINGS
  # -----------------------------
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  depends_on = [
    aws_s3_bucket_website_configuration.frontend,
    aws_lb.app_alb
  ]
}
