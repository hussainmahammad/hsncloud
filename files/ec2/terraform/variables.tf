variable "region" {
  default = "us-east-1"
}

variable "instance_type" {
  default = "t3.micro"
}

variable "key_name" {}

variable "bucket_name" {}

variable "app_name" {
  default = "hsncloud"
}
