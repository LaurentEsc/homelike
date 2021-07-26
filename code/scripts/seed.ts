process.env.AWS_SDK_LOAD_CONFIG = '1';
process.env.AWS_PROFILE = 'laurent';

import { createProperty } from "../src/database/properties";
import { Property, User } from "../src/types";

const user: User = {
  userId: '421d459a-0ec4-4aae-8bd6-40537f6e0026',
  email: 'escalier.laurent@gmail.com',
  givenName: 'Laurent',
}

const minLongitude = 42.914787533511706;
const maxLongitude = 42.99246381379465;
const minLatitude = 1.5495863024994876;
const maxLatitude = 1.693297874264651;

const randomNumberOfRooms = () => Math.floor(Math.random() * 6);
const randomLocation = () => {
  const longitude = Math.random() * (maxLongitude - minLongitude) + minLongitude;
  const latitude = Math.random() * (minLatitude - maxLatitude) + maxLatitude;

  return { longitude, latitude }
};

const seedProperties = async () => {
  const promises: Promise<Property>[] = [];

  for (let i=0; i<100; i++) {
    const input = {
      name: `Property${i}`,
      location: randomLocation(),
      country: 'FR',
      city: 'Foix',
      numberOfRooms: randomNumberOfRooms()
    }

    promises.push(createProperty(input, user).then(property => {
      console.log(`Property [${property.id}] has been created`)
      return property;
    }));
  }

  await Promise.all(promises);
}

seedProperties();