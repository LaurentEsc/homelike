import { APIGatewayProxyResult } from 'aws-lambda';
import { AuthData } from '../types';

export const signInSuccessResponse = (authData: AuthData): APIGatewayProxyResult => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: authData,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  };
};
