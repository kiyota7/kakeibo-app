# RDS(MySQL)。EC2からのみ接続できるよう、セキュリティグループでEC2側のSGのみを許可し、
# publicly_accessible = false でインターネットからは一切到達できないようにする。

resource "aws_db_subnet_group" "app" {
  name       = "kakeibo-db-subnet-group"
  subnet_ids = data.aws_subnets.default.ids

  tags = {
    Name = "kakeibo-db-subnet-group"
  }
}

resource "aws_security_group" "rds" {
  name        = "kakeibo-rds-sg"
  description = "Allow MySQL access from the app EC2 instance only"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "MySQL from app EC2"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "kakeibo-rds-sg"
  }
}

resource "aws_db_instance" "app" {
  identifier     = "kakeibo-db"
  engine         = "mysql"
  engine_version = "8.0"
  instance_class = "db.t3.micro"

  allocated_storage = 20
  storage_type      = "gp2"

  db_name  = "kakeibo"
  username = "kakeibo"
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.app.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  multi_az               = false

  backup_retention_period = 1
  skip_final_snapshot     = true
  deletion_protection     = false

  tags = {
    Name = "kakeibo-db"
  }
}
