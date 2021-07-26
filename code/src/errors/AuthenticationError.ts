import { ApiError } from "./ApiError";

export class AuthenticationError extends Error implements ApiError {
  statusCode: number = 401;

  constructor() {
    super('A problem occurred during authentication');
  }
}