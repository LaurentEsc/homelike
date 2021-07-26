import DynamoDB from "aws-sdk/clients/dynamodb";

export const db = new DynamoDB.DocumentClient();