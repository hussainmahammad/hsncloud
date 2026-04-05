resource "aws_db_subnet_group" "db_subnet" {
  name       = "${var.app_name}-db-subnet"

  # ✅ limit subnets (prevents slow placement issues)
  subnet_ids = slice(data.aws_subnets.default.ids, 0, 2)

  tags = {
    Name = "${var.app_name}-db-subnet"
  }
}

resource "aws_security_group" "rds_sg" {
  name = "${var.app_name}-rds-sg"

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "db" {
  identifier = "${var.app_name}-db"

  engine         = "mysql"
  engine_version = "8.0"

  instance_class = "db.t3.micro"

  allocated_storage = 20

  db_name  = "hsncloud"
  username = "admin"
  password = "Admin12345!"

  publicly_accessible = false

  # ✅ CRITICAL FIXES (DO NOT REMOVE)
  apply_immediately       = true
  backup_retention_period = 0
  storage_type            = "gp2"
  skip_final_snapshot     = true

  # ✅ networking
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.db_subnet.name

  # ✅ fastest config
  multi_az = false

  # ✅ avoids deletion issues in demo cycles
  deletion_protection = false
}
