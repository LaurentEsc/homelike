import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { createProperty } from '../../database/properties';
import { getApiUser, handleError } from '../../utils/api';
import { cast } from '../../utils/validation';
import { createPropertySuccessResponse } from './responses/createPropertySuccessResponse';
import { CreatePropertyInput } from './types';
import { createPropertySchema as schema } from './validation/createPropertySchema';

export default async (
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const user = getApiUser(event);
    const input = cast<CreatePropertyInput>(event.body, schema);

    const property = await createProperty(input, user);

    return createPropertySuccessResponse(property);
  }
  catch (error) {
    return handleError(error);
  }
};