import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { getFavoritesByUser } from '../../database/favorites';
import { getApiUser, handleError } from '../../utils/api';
import { listMyFavoritesSuccessResponse } from './responses/listMyFavoritesSuccessResponse';

export default async (
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const user = getApiUser(event);

    const favorites = await getFavoritesByUser(user);

    return listMyFavoritesSuccessResponse(favorites.map(favorite => favorite.property));
  }
  catch (error) {
    return handleError(error);
  }
};