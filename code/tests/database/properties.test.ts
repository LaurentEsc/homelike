import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Long from "long";
import { nanoid } from "nanoid";
import { createProperty, getPropertyById } from "../../src/database/properties";
import { CreatePropertyInput } from "../../src/functions/createProperty/types";
import { Property } from "../../src/types";
import { db } from "../../src/utils/db";
import { S2Util } from "../../src/utils/s2/S2Util";

jest.mock('nanoid');

const property: Property = {
  id: 'propertyId',
  name: 'propertyName',
  owner: {
    userId: 'ownerId',
    email: 'owner@email.com',
    givenName: 'John'
  },
  city: 'COLOGNE',
  country: 'DE',
  location: {
    longitude: 50.94834516753191,
    latitude: 6.945339997864456
  },
  numberOfRooms: 2
}

const propertyRecord: DocumentClient.AttributeMap = {
  PK: `PROPERTY#${property.id}`,
  SK: `PROPERTY#${property.id}`,
  propertyName: property.name,
  location: `${property.country}#${property.city}`,
  locationJson: JSON.stringify(property.location),
  ownerJson: JSON.stringify(property.owner),
  numberOfRooms: property.numberOfRooms
}

const mockQuery = (items: DocumentClient.AttributeMap[]): jest.Mock => {
  const mock = jest.spyOn(db, 'query') as jest.Mock;

  return mock.mockReturnValue({
    promise: () => Promise.resolve({ Items: items, Count: items.length }),
  });
}

const mockPutItem = (): jest.Mock => {
  const mock = jest.spyOn(db, 'put') as jest.Mock;

  return mock.mockReturnValue({
    promise: () => Promise.resolve({}),
  });
}

const mockNanoId = (nanoId: string): jest.Mock => {
  const mock = nanoid as jest.Mock;

  return mock.mockImplementation(() => nanoId);
}

const mockMakeGeoHash = (geoHash: Long): jest.Mock => {
  const mock = jest.spyOn(S2Util, 'makeGeoHash') as jest.Mock;

  return mock.mockReturnValue(geoHash);
}

const mockMakeHashKey = (hashKey: Long): jest.Mock => {
  const mock = jest.spyOn(S2Util, 'makeHashKey') as jest.Mock;

  return mock.mockReturnValue(hashKey);
}

describe('database_properties', () => {

  beforeEach(jest.resetAllMocks);

  test('should_get_a_property_by_id', async () => {
    const dbQuerySpy = mockQuery([propertyRecord]);

    const response = await getPropertyById(property.id);

    expect(dbQuerySpy).toHaveBeenCalledTimes(1);
    expect(dbQuerySpy).toHaveBeenCalledWith({
      TableName: 'homelike',
      KeyConditionExpression : 'PK = :propertyId and SK = :propertyId',  
      ExpressionAttributeValues : {
        ':propertyId' : `PROPERTY#${property.id}`,
      }
    });

    expect(response).toEqual(property);
  });

  test('should_create_a_new_property', async () => {
    const nanoIdSpy = mockNanoId(property.id);
    const dbPutItemSpy = mockPutItem();

    const geoHash = Long.fromString('4399009627099163077', false, 10);
    const hashKey = Long.fromString('439900', false, 10);

    const makeGeoHashSpy = mockMakeGeoHash(geoHash);
    const makeHashKeySpy = mockMakeHashKey(hashKey);

    const input: CreatePropertyInput = {
      name: property.name,
      country: property.country,
      city: property.city,
      location: property.location,
      numberOfRooms: property.numberOfRooms
    };

    const response = await createProperty(input, property.owner);
    
    expect(nanoIdSpy).toHaveBeenCalledTimes(1);

    expect(makeGeoHashSpy).toHaveBeenCalledTimes(1);
    expect(makeGeoHashSpy).toHaveBeenCalledWith(input.location);

    expect(makeHashKeySpy).toHaveBeenCalledTimes(1);
    expect(makeHashKeySpy).toHaveBeenCalledWith(geoHash);

    expect(dbPutItemSpy).toHaveBeenCalledTimes(1);
    expect(dbPutItemSpy).toHaveBeenCalledWith({
      TableName: 'homelike',
      Item: {
        PK: `PROPERTY#${property.id}`,
        SK: `PROPERTY#${property.id}`,
        GSI1_PK: `USER#${property.owner.userId}`,
        GSI1_SK: `PROPERTY#${property.id}`,
        GSI2_PK: `HASHKEY#${hashKey}`,
        GSI2_SK: `GEOHASH#${geoHash}`,
        propertyName: property.name,
        numberOfRooms: property.numberOfRooms,
        location: `${property.country.toUpperCase()}#${property.city.toUpperCase()}`,
        locationJson: JSON.stringify(property.location),
        ownerJson: JSON.stringify(property.owner),
      },
    });

    expect(response).toEqual(property);
  });
  
});
