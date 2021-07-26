import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { handleError } from '../../utils/api';
import { confirmUser, signUp } from '../../utils/cognito';
import { cast } from '../../utils/validation';
import { signUpSuccessResponse } from './responses/signUpSuccessResponse';
import { SignUpInput } from './types';
import { signUpSchema as schema } from './validation/signUpSchema';

export default async (
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const input = cast<SignUpInput>(event.body, schema);

    const user = await signUp(input);
    await confirmUser(user);

    return signUpSuccessResponse(user);
  }
  catch (error) {
    return handleError(error);
  }
};
