import { JSONSchemaType } from "ajv"
import { MarkPropertyAsFavoriteInput } from "../types"

export const markPropertyHasFavoriteSchema: JSONSchemaType<MarkPropertyAsFavoriteInput> = {
  type: "object",
  properties: {
    propertyId: { type: "string" },
  },
  required: ["propertyId"],
  additionalProperties: false
}