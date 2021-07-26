import { ApiError } from "./ApiError";

export class MissingEnvironmentVariableError extends Error implements ApiError {
  statusCode: number = 500;

  constructor (variableName: string) {
    super(`Missing environment variable [${variableName}]`)
  }
}