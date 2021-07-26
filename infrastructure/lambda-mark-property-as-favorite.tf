resource "aws_lambda_function" "mark_property_as_favorite" {
  function_name = "homelike_mark_property_as_favorite"
  filename      = data.archive_file.lambda_placeholder.output_path
  role          = aws_iam_role.mark_property_as_favorite.arn
  handler       = "index.default"
  runtime       = "nodejs14.x"
  timeout       = 300
  tags          = var.aws_tags
}

resource "aws_cloudwatch_log_group" "mark_property_as_favorite" {
  name              = "/aws/lambda/homelike_mark_property_as_favorite"
  retention_in_days = 14
}

resource "aws_iam_role" "mark_property_as_favorite" {
  name = "homelike_mark_property_as_favorite"

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

data "aws_iam_policy_document" "mark_property_as_favorite" {
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:PutLogEventsBatch",
    ]
    resources = ["${aws_cloudwatch_log_group.mark_property_as_favorite.arn}:*"]
  }

  statement {
    actions = [
      "dynamodb:PutItem",
      "dynamodb:Query"
    ]
    resources = [
      aws_dynamodb_table.homelike.arn,
    ]
  }
}

resource "aws_iam_policy" "mark_property_as_favorite" {
  name   = "homelike_mark_property_as_favorite"
  policy = data.aws_iam_policy_document.mark_property_as_favorite.json
}

resource "aws_iam_policy_attachment" "mark_property_as_favorite" {
  name       = "homelike_mark_property_as_favorite"
  roles      = [ aws_iam_role.mark_property_as_favorite.name ]
  policy_arn = aws_iam_policy.mark_property_as_favorite.arn

}

resource "aws_lambda_permission" "mark_property_as_favorite" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.mark_property_as_favorite.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.homelike.execution_arn}/*/${aws_api_gateway_method.mark_property_as_favorite.http_method}${aws_api_gateway_resource.my_favorites.path}"
}
