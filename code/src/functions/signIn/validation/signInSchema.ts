import { JSONSchemaType } from "ajv"
import { SignInInput } from "../types"

export const signInSchema: JSONSchemaType<SignInInput> = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
  },
  required: ["email", "password"],
  additionalProperties: false
}