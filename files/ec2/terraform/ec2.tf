resource "aws_instance" "app" {
  ami           = "ami-0ec10929233384c7f"
  instance_type = "m7i-flex.large"
  key_name      = var.key_name

  vpc_security_group_ids = [aws_security_group.ec2_sg.id]

  tags = {
    Name = "${var.app_name}-ec2"
  }
}
