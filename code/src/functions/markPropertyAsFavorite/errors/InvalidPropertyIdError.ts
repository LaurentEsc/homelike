import { ApiError } from "../../../errors/ApiError";

export class InvalidPropertyIdError extends Error implements ApiError {
  statusCode: number = 400;

  constructor(propertyId: string) {
    super(`Property id [${propertyId}] does not match any existing property`);
  }
}