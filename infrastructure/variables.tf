variable "aws_tags" {
  type = map
  default = {
    product : "homelike",
    terraform : "yes",
  }
}