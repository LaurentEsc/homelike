resource "aws_lambda_function" "list_my_favorites" {
  function_name = "homelike_list_my_favorites"
  filename      = data.archive_file.lambda_placeholder.output_path
  role          = aws_iam_role.list_my_favorites.arn
  handler       = "index.default"
  runtime       = "nodejs14.x"
  timeout       = 300
  tags          = var.aws_tags
}

resource "aws_cloudwatch_log_group" "list_my_favorites" {
  name              = "/aws/lambda/homelike_list_my_favorites"
  retention_in_days = 14
}

resource "aws_iam_role" "list_my_favorites" {
  name = "homelike_list_my_favorites"

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

data "aws_iam_policy_document" "list_my_favorites" {
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:PutLogEventsBatch",
    ]
    resources = ["${aws_cloudwatch_log_group.list_my_favorites.arn}:*"]
  }

  statement {
    actions = [
      "dynamodb:Query",
    ]
    resources = [
      aws_dynamodb_table.homelike.arn,
      "${aws_dynamodb_table.homelike.arn}/index/*"
    ]
  }
}

resource "aws_iam_policy" "list_my_favorites" {
  name   = "homelike_list_my_favorites"
  policy = data.aws_iam_policy_document.list_my_favorites.json
}

resource "aws_iam_policy_attachment" "list_my_favorites" {
  name       = "homelike_list_my_favorites"
  roles      = [ aws_iam_role.list_my_favorites.name ]
  policy_arn = aws_iam_policy.list_my_favorites.arn

}

resource "aws_lambda_permission" "list_my_favorites" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.list_my_favorites.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.homelike.execution_arn}/*/${aws_api_gateway_method.list_my_favorites.http_method}${aws_api_gateway_resource.my_favorites.path}"
}
