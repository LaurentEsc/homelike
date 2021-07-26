import { APIGatewayProxyResult } from 'aws-lambda';
import { Favorite } from '../../../types';

export const markPropertyAsFavoriteSuccessResponse = (favorite: Favorite): APIGatewayProxyResult => {
  return {
    statusCode: 201,
    body: JSON.stringify({
      data: favorite,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  };
};
