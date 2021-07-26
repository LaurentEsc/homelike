resource "aws_lambda_function" "sign_in" {
  function_name = "homelike_sign_in"
  filename      = data.archive_file.lambda_placeholder.output_path
  role          = aws_iam_role.sign_in.arn
  handler       = "index.default"
  runtime       = "nodejs14.x"
  timeout       = 300
  tags          = var.aws_tags

  environment {
    variables = {
      USER_POOL_CLIENT_ID = aws_cognito_user_pool_client.client.id
    }
  }
}

resource "aws_cloudwatch_log_group" "sign_in" {
  name              = "/aws/lambda/homelike_sign_in"
  retention_in_days = 14
}

resource "aws_iam_role" "sign_in" {
  name = "homelike_sign_in"

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

data "aws_iam_policy_document" "sign_in" {
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:PutLogEventsBatch",
    ]
    resources = ["${aws_cloudwatch_log_group.sign_in.arn}:*"]
  }

  statement {
    actions = [
      "cognito-idp:InitiateAuth",
    ]
    resources = [
      aws_cognito_user_pool.pool.arn
    ]
  }
}

resource "aws_iam_policy" "sign_in" {
  name   = "homelike_sign_in"
  policy = data.aws_iam_policy_document.sign_in.json
}

resource "aws_iam_policy_attachment" "sign_in" {
  name       = "homelike_sign_in"
  roles      = [ aws_iam_role.sign_in.name ]
  policy_arn = aws_iam_policy.sign_in.arn

}

resource "aws_lambda_permission" "sign_in" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.sign_in.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.homelike.execution_arn}/*/${aws_api_gateway_method.sign_in.http_method}${aws_api_gateway_resource.sign_in.path}"
}
