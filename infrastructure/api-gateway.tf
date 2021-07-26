# Rest API

resource "aws_api_gateway_rest_api" "homelike" {
  name        = "homelike"
  description = "Homelike Rental Services"
  tags        = var.aws_tags
}

resource "aws_api_gateway_authorizer" "homelike_cognito" {
  name          = "homelike_cognito_authorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.homelike.id
  provider_arns = [aws_cognito_user_pool.pool.arn]
}

# Resources

resource "aws_api_gateway_resource" "sign_up" {
  rest_api_id = aws_api_gateway_rest_api.homelike.id
  parent_id   = aws_api_gateway_rest_api.homelike.root_resource_id
  path_part   = "sign-up"
}

resource "aws_api_gateway_resource" "sign_in" {
  rest_api_id = aws_api_gateway_rest_api.homelike.id
  parent_id   = aws_api_gateway_rest_api.homelike.root_resource_id
  path_part   = "sign-in"
}

resource "aws_api_gateway_resource" "properties" {
  rest_api_id = aws_api_gateway_rest_api.homelike.id
  parent_id   = aws_api_gateway_rest_api.homelike.root_resource_id
  path_part   = "properties"
}

resource "aws_api_gateway_resource" "me" {
  rest_api_id = aws_api_gateway_rest_api.homelike.id
  parent_id   = aws_api_gateway_rest_api.homelike.root_resource_id
  path_part   = "me"
}

resource "aws_api_gateway_resource" "my_favorites" {
  rest_api_id = aws_api_gateway_rest_api.homelike.id
  parent_id   = aws_api_gateway_resource.me.id
  path_part   = "favorites"
}

# Sign Up

resource "aws_api_gateway_method" "sign_up" {
  rest_api_id   = aws_api_gateway_rest_api.homelike.id
  resource_id   = aws_api_gateway_resource.sign_up.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "sign_up" {
  rest_api_id             = aws_api_gateway_rest_api.homelike.id
  resource_id             = aws_api_gateway_resource.sign_up.id
  http_method             = aws_api_gateway_method.sign_up.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.sign_up.invoke_arn
}

# Sign In

resource "aws_api_gateway_method" "sign_in" {
  rest_api_id   = aws_api_gateway_rest_api.homelike.id
  resource_id   = aws_api_gateway_resource.sign_in.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "sign_in" {
  rest_api_id             = aws_api_gateway_rest_api.homelike.id
  resource_id             = aws_api_gateway_resource.sign_in.id
  http_method             = aws_api_gateway_method.sign_in.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.sign_in.invoke_arn
}

# Create property

resource "aws_api_gateway_method" "create_property" {
  rest_api_id   = aws_api_gateway_rest_api.homelike.id
  resource_id   = aws_api_gateway_resource.properties.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.homelike_cognito.id
}

resource "aws_api_gateway_integration" "create_property" {
  rest_api_id             = aws_api_gateway_rest_api.homelike.id
  resource_id             = aws_api_gateway_resource.properties.id
  http_method             = aws_api_gateway_method.create_property.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.create_property.invoke_arn
}

# Search properties

resource "aws_api_gateway_method" "search_properties" {
  rest_api_id   = aws_api_gateway_rest_api.homelike.id
  resource_id   = aws_api_gateway_resource.properties.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "search_properties" {
  rest_api_id             = aws_api_gateway_rest_api.homelike.id
  resource_id             = aws_api_gateway_resource.properties.id
  http_method             = aws_api_gateway_method.search_properties.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.search_properties.invoke_arn
}

# Mark property as favorite

resource "aws_api_gateway_method" "mark_property_as_favorite" {
  rest_api_id   = aws_api_gateway_rest_api.homelike.id
  resource_id   = aws_api_gateway_resource.my_favorites.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.homelike_cognito.id
}

resource "aws_api_gateway_integration" "mark_property_as_favorite" {
  rest_api_id             = aws_api_gateway_rest_api.homelike.id
  resource_id             = aws_api_gateway_resource.my_favorites.id
  http_method             = aws_api_gateway_method.mark_property_as_favorite.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.mark_property_as_favorite.invoke_arn
}

# List my favorite properties

resource "aws_api_gateway_method" "list_my_favorites" {
  rest_api_id   = aws_api_gateway_rest_api.homelike.id
  resource_id   = aws_api_gateway_resource.my_favorites.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.homelike_cognito.id
}

resource "aws_api_gateway_integration" "list_my_favorites" {
  rest_api_id             = aws_api_gateway_rest_api.homelike.id
  resource_id             = aws_api_gateway_resource.my_favorites.id
  http_method             = aws_api_gateway_method.list_my_favorites.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.list_my_favorites.invoke_arn
}

# Deployment and stage

resource "aws_api_gateway_deployment" "homelike" {
  rest_api_id       = aws_api_gateway_rest_api.homelike.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.sign_up.id,
      aws_api_gateway_method.sign_up.id,
      aws_api_gateway_integration.sign_up.id,
      aws_api_gateway_resource.sign_in.id,
      aws_api_gateway_method.sign_in.id,
      aws_api_gateway_integration.sign_in.id,
      aws_api_gateway_resource.properties.id,
      aws_api_gateway_method.create_property.id,
      aws_api_gateway_integration.create_property.id,
      aws_api_gateway_method.search_properties.id,
      aws_api_gateway_integration.search_properties.id,
      aws_api_gateway_resource.me.id,
      aws_api_gateway_resource.my_favorites.id,
      aws_api_gateway_method.mark_property_as_favorite.id,
      aws_api_gateway_integration.mark_property_as_favorite.id,
      aws_api_gateway_method.list_my_favorites.id,
      aws_api_gateway_integration.list_my_favorites.id,
    ]))
  }
  
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "homelike" {
  stage_name    = "default"
  rest_api_id   = aws_api_gateway_rest_api.homelike.id
  deployment_id = aws_api_gateway_deployment.homelike.id
}