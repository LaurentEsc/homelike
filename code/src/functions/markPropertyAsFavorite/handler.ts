import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { markPropertyAsFavorite } from '../../database/favorites';
import { getPropertyById } from '../../database/properties';
import { getApiUser, handleError } from '../../utils/api';
import { cast } from '../../utils/validation';
import { InvalidPropertyIdError } from './errors/InvalidPropertyIdError';
import { markPropertyAsFavoriteSuccessResponse } from './responses/markPropertyAsFavoriteSuccessResponse';
import { MarkPropertyAsFavoriteInput } from './types';
import { markPropertyHasFavoriteSchema as schema } from './validation/markPropertyHasFavoriteSchema';

export default async (
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const user = getApiUser(event);
    const input = cast<MarkPropertyAsFavoriteInput>(event.body, schema);

    const property = await getPropertyById(input.propertyId);

    if (! property) {
      throw new InvalidPropertyIdError(input.propertyId);
    }

    const favorite = await markPropertyAsFavorite(user, property);

    return markPropertyAsFavoriteSuccessResponse(favorite);
  }
  catch (error) {
    return handleError(error);
  }
};