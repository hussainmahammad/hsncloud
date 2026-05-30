terraform {
  backend "s3" {
    bucket  = "tfstates-hussainmahammad.online"
    key     = "hsncloud/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}
