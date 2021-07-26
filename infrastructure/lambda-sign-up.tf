resource "aws_lambda_function" "sign_up" {
  function_name = "homelike_sign_up"
  filename      = data.archive_file.lambda_placeholder.output_path
  role          = aws_iam_role.sign_up.arn
  handler       = "index.default"
  runtime       = "nodejs14.x"
  timeout       = 300
  tags          = var.aws_tags

  environment {
    variables = {
      USER_POOL_ID = aws_cognito_user_pool.pool.id
      USER_POOL_CLIENT_ID = aws_cognito_user_pool_client.client.id
    }
  }
}

resource "aws_cloudwatch_log_group" "sign_up" {
  name              = "/aws/lambda/homelike_sign_up"
  retention_in_days = 14
}

resource "aws_iam_role" "sign_up" {
  name = "homelike_sign_up"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF

  tags = var.aws_tags
}

data "aws_iam_policy_document" "sign_up" {
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:PutLogEventsBatch",
    ]
    resources = ["${aws_cloudwatch_log_group.sign_up.arn}:*"]
  }

  statement {
    actions = [
      "cognito-idp:SignUp",
      "cognito-idp:AdminConfirmSignUp",
    ]
    resources = [
      aws_cognito_user_pool.pool.arn
    ]
  }
}

resource "aws_iam_policy" "sign_up" {
  name   = "homelike_sign_up"
  policy = data.aws_iam_policy_document.sign_up.json
}

resource "aws_iam_policy_attachment" "sign_up" {
  name       = "homelike_sign_up"
  roles      = [ aws_iam_role.sign_up.name ]
  policy_arn = aws_iam_policy.sign_up.arn

}

resource "aws_lambda_permission" "sign_up" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.sign_up.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.homelike.execution_arn}/*/${aws_api_gateway_method.sign_up.http_method}${aws_api_gateway_resource.sign_up.path}"
}
