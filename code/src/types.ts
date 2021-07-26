export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export type User = {
  userId: string
  email: string;
  givenName: string;
}

export type Property = {
  id: string;
  name: string;
  country: string;
  city: string;
  location: GeoPoint;
  owner: User;
  numberOfRooms: number;
}

export type Favorite = {
  user: User;
  property: Property;
}