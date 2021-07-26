resource "aws_cognito_user_pool" "pool" {
  name = "homelike"

  auto_verified_attributes = [
    "email"
  ]

  username_attributes = [
    "email"
  ]

  password_policy {
    minimum_length                   = 8
    require_lowercase                = false
    require_numbers                  = false
    require_symbols                  = false
    require_uppercase                = false
    temporary_password_validity_days = 7
  }

  tags = var.aws_tags
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "homelike"
  user_pool_id = aws_cognito_user_pool.pool.id
}

resource "aws_cognito_user_pool_client" "client" {
  name = "homelike_client"

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]

  user_pool_id = aws_cognito_user_pool.pool.id
}
