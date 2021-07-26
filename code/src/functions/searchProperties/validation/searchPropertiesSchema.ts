import { JSONSchemaType } from "ajv"
import { SearchPropertiesInput } from "../types"

export const searchPropertiesSchema: JSONSchemaType<SearchPropertiesInput> = {
  type: "object",
  properties: {
    longitude: { type: "number" },
    latitude: { type: "number" },
    radiusInMeters: { type: "integer" },
  },
  required: ["longitude", "latitude", "radiusInMeters"],
  additionalProperties: false
}