import { APIGatewayProxyResult } from 'aws-lambda';
import { Property } from '../../../types';

export const listMyFavoritesSuccessResponse = (properties: Property[]): APIGatewayProxyResult => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: properties,
      metadata: {
        count: properties.length
      }
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  };
};
