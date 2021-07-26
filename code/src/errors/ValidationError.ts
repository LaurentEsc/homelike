import { ErrorObject } from "ajv";
import { ApiError } from "./ApiError";

export class ValidationError extends Error implements ApiError {
  statusCode: number = 422;
  details?: Record<string, unknown>;

  constructor(errors: ErrorObject[] = []) {
    super('The request data is invalid');
    this.details = {
      errors
    }
  }
}