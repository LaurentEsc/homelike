import { JSONSchemaType } from "ajv"
import { SignUpInput } from "../types"

export const signUpSchema: JSONSchemaType<SignUpInput> = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
    givenName: { type: "string" },
  },
  required: ["email", "password", "givenName"],
  additionalProperties: false
}