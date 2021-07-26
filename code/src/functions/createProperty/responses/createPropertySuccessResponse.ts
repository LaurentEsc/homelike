import { APIGatewayProxyResult } from 'aws-lambda';
import { Property } from '../../../types';

export const createPropertySuccessResponse = (property: Property): APIGatewayProxyResult => {
  return {
    statusCode: 201,
    body: JSON.stringify({
      data: property,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  };
};
