import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { ApiError } from "../errors/ApiError";
import { AuthenticationError } from "../errors/AuthenticationError";
import { User } from "../types";
import { logger } from "./logger";

export const getApiUser = (event: APIGatewayEvent): User => {
  try {
    const claims = event.requestContext.authorizer?.claims;

    return {
      userId: claims.sub,
      email: claims.email,
      givenName: claims.given_name,
    }
  } catch (error) {
    throw new AuthenticationError();
  }
}

const isApiError = (error: any): error is ApiError => {
  return error.statusCode !== undefined;
}

export const handleError = (error: any): APIGatewayProxyResult => {
  logger.error(error);

  if (error instanceof Error && isApiError(error)) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify({
        error: {
          message: error.message,
          statusCode: error.statusCode,
          details: error.details
        }
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    }
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      error: {
        message: 'Internal server error',
        statusCode: 500,
        details: error
      }
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  }
}