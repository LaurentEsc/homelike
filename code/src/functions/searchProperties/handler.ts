import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { searchProperties } from '../../database/properties';
import { handleError } from '../../utils/api';
import { cast } from '../../utils/validation';
import { searchPropertiesSuccessResponse } from './responses/searchPropertiesSuccessResponse';
import { SearchPropertiesInput } from './types';
import { searchPropertiesSchema as schema } from './validation/searchPropertiesSchema';

export default async (
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const input = cast<SearchPropertiesInput>(event.queryStringParameters, schema);

    const properties = await searchProperties(input);

    return searchPropertiesSuccessResponse(properties);
  }
  catch (error) {
    return handleError(error);
  }
};