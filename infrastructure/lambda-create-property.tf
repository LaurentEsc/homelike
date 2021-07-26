resource "aws_lambda_function" "create_property" {
  function_name = "homelike_create_property"
  filename      = data.archive_file.lambda_placeholder.output_path
  role          = aws_iam_role.create_property.arn
  handler       = "index.default"
  runtime       = "nodejs14.x"
  timeout       = 300
  tags          = var.aws_tags
}

resource "aws_cloudwatch_log_group" "create_property" {
  name              = "/aws/lambda/homelike_create_property"
  retention_in_days = 14
}

resource "aws_iam_role" "create_property" {
  name = "homelike_create_property"

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

data "aws_iam_policy_document" "create_property" {
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:PutLogEventsBatch",
    ]
    resources = ["${aws_cloudwatch_log_group.create_property.arn}:*"]
  }

  statement {
    actions = [
      "dynamodb:PutItem",
    ]
    resources = [
      aws_dynamodb_table.homelike.arn,
    ]
  }
}

resource "aws_iam_policy" "create_property" {
  name   = "homelike_create_property"
  policy = data.aws_iam_policy_document.create_property.json
}

resource "aws_iam_policy_attachment" "create_property" {
  name       = "homelike_create_property"
  roles      = [ aws_iam_role.create_property.name ]
  policy_arn = aws_iam_policy.create_property.arn

}

resource "aws_lambda_permission" "create_property" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_property.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.homelike.execution_arn}/*/${aws_api_gateway_method.create_property.http_method}${aws_api_gateway_resource.properties.path}"
}
