import { APIGatewayProxyResult } from 'aws-lambda';
import { User } from '../../../types';

export const signUpSuccessResponse = (user: User): APIGatewayProxyResult => {
  return {
    statusCode: 201,
    body: JSON.stringify({
      data: user,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  };
};
