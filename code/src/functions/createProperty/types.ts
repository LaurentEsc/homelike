import { GeoPoint } from "../../types";

export type CreatePropertyInput = {
  name: string;
  country: string;
  city: string;
  location: GeoPoint;
  numberOfRooms: number;
}