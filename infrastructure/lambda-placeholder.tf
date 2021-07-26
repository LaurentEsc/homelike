data "archive_file" "lambda_placeholder" {
  type                    = "zip"
  source_content          = "console.log('it works!')"
  source_content_filename = "index.js"
  output_path             = "placeholder-lambda.zip"
}