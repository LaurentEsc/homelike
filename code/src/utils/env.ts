import { MissingEnvironmentVariableError } from "../errors/MissingEnvironmentVariableError";

export const getEnv = (variableName: string, defaultValue?: string): string => {
  const value = process.env[variableName] || defaultValue;

  if (value === undefined) {
    throw new MissingEnvironmentVariableError(variableName);
  }

  return value;
};