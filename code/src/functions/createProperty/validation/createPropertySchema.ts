import { JSONSchemaType } from "ajv"
import { CreatePropertyInput } from "../types"

export const createPropertySchema: JSONSchemaType<CreatePropertyInput> = {
  type: "object",
  properties: {
    name: { type: "string" },
    country: { type: "string", maxLength: 2 },
    city: { type: "string" },
    location: {
      type: "object",
      properties: {
        longitude: { type: "number" },
        latitude: { type: "number" },
      },
      required: ["longitude", "latitude"],
    },
    numberOfRooms: { type: "integer" },
  },
  required: ["name", "country", "city", "location", "numberOfRooms"],
  additionalProperties: false
}