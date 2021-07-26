import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { handleError } from '../../utils/api';
import { signIn } from '../../utils/cognito';
import { cast } from '../../utils/validation';
import { signInSuccessResponse } from './responses/signInSuccessResponse';
import { SignInInput } from './types';
import { signInSchema as schema } from './validation/signInSchema';

export default async (
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const input = cast<SignInInput>(event.body, schema);

    const authData = await signIn(input);

    return signInSuccessResponse(authData);
  }
  catch (error) {
    return handleError(error);
  }
};
