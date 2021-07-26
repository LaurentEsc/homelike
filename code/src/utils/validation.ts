import Ajv, { JSONSchemaType } from 'ajv';
import { ValidationError } from '../errors/ValidationError';

export const cast = <T extends object>(
  data: object | string | null,
  schema: JSONSchemaType<T>,
): T => {
  const object = typeof data === 'string' ? JSON.parse(data) : data || {}

  const ajv = new Ajv({ coerceTypes: true, allErrors: true });

  const validate = ajv.compile(schema)

  if (! validate(object)) {
    throw new ValidationError(validate.errors || []);
  }

  return object;
};