resource "aws_lambda_function" "search_properties" {
  function_name = "homelike_search_properties"
  filename      = data.archive_file.lambda_placeholder.output_path
  role          = aws_iam_role.search_properties.arn
  handler       = "index.default"
  runtime       = "nodejs14.x"
  timeout       = 300
  tags          = var.aws_tags
}

resource "aws_cloudwatch_log_group" "search_properties" {
  name              = "/aws/lambda/homelike_search_properties"
  retention_in_days = 14
}

resource "aws_iam_role" "search_properties" {
  name = "homelike_search_properties"

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

data "aws_iam_policy_document" "search_properties" {
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:PutLogEventsBatch",
    ]
    resources = ["${aws_cloudwatch_log_group.search_properties.arn}:*"]
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

resource "aws_iam_policy" "search_properties" {
  name   = "homelike_search_properties"
  policy = data.aws_iam_policy_document.search_properties.json
}

resource "aws_iam_policy_attachment" "search_properties" {
  name       = "homelike_search_properties"
  roles      = [ aws_iam_role.search_properties.name ]
  policy_arn = aws_iam_policy.search_properties.arn

}

resource "aws_lambda_permission" "search_properties" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.search_properties.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.homelike.execution_arn}/*/${aws_api_gateway_method.search_properties.http_method}${aws_api_gateway_resource.properties.path}"
}
