resource "aws_s3_bucket" "frontend" {
  bucket = "${var.app_name}-frontend-${random_id.bucket_id.hex}"

  tags = {
    Name = "${var.app_name}-frontend"
  }
}

resource "random_id" "bucket_id" {
  byte_length = 4
}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls   = false
  block_public_policy = false
  ignore_public_acls  = false
  restrict_public_buckets = false
}
