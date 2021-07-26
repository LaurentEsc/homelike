import * as AWS from 'aws-sdk';
import { AuthenticationError } from '../errors/AuthenticationError';
import { AuthData, SignInInput } from '../functions/signIn/types';
import { SignUpInput } from '../functions/signUp/types';
import { User } from "../types";
import { getEnv } from "./env";

const cognito = new AWS.CognitoIdentityServiceProvider();

export const signIn = async (input: SignInInput): Promise<AuthData> => {
  return cognito.initiateAuth({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: getEnv('USER_POOL_CLIENT_ID'),
    AuthParameters: {
      USERNAME: input.email,
      PASSWORD: input.password
    }
  }).promise().then(response => {
    const accessToken = response.AuthenticationResult?.AccessToken;
    const refreshToken = response.AuthenticationResult?.RefreshToken;
    const idToken = response.AuthenticationResult?.IdToken;
    const expiresInSeconds = response.AuthenticationResult?.ExpiresIn;

    if (! accessToken || ! refreshToken || ! idToken || ! expiresInSeconds) {
      throw new AuthenticationError();
    }

    return {
      accessToken,
      refreshToken,
      idToken,
      expiresInSeconds,
    }
  });
}

export const signUp = async (input: SignUpInput): Promise<User> => {
  return cognito.signUp({
    ClientId: getEnv('USER_POOL_CLIENT_ID'),
    Username: input.email,
    Password: input.password,
    UserAttributes: [
      { Name: 'given_name', Value: input.givenName }
    ]
  }).promise()
  .then(response => ({
    userId: response.UserSub,
    email: input.email,
    givenName: input.givenName
  }));
}

export const confirmUser = async (user: User): Promise<void> => {
  return cognito.adminConfirmSignUp({
    UserPoolId: getEnv('USER_POOL_ID'),
    Username: user.email
  }).promise()
  .then();
}