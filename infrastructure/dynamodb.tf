resource "aws_dynamodb_table" "homelike" {
  name         = "homelike"
  billing_mode = "PAY_PER_REQUEST"
  
  hash_key     = "PK"
  range_key    = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  attribute {
    name = "GSI1_PK"
    type = "S"
  }

  attribute {
    name = "GSI1_SK"
    type = "S"
  }

  attribute {
    name = "GSI2_PK"
    type = "S"
  }

  attribute {
    name = "GSI2_SK"
    type = "S"
  }

  global_secondary_index {
    name               = "GSI1"
    hash_key           = "GSI1_PK"
    range_key          = "GSI1_SK"
    projection_type = "ALL"
  }

  global_secondary_index {
    name               = "GSI2"
    hash_key           = "GSI2_PK"
    range_key          = "GSI2_SK"
    projection_type = "ALL"
  }

  server_side_encryption {
    enabled = "true"
  }

  tags = var.aws_tags
}