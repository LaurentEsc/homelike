import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { nanoid } from "nanoid";
import { CreatePropertyInput } from "../functions/createProperty/types";
import { SearchPropertiesInput } from "../functions/searchProperties/types";
import { Property, User } from "../types";
import { db } from "../utils/db";
import { S2Util } from "../utils/s2/S2Util";

export const getPropertyById = async (propertyId: string): Promise<Property | null> => {
  return db.query({
    TableName: 'homelike',
    KeyConditionExpression : 'PK = :propertyId and SK = :propertyId',  
    ExpressionAttributeValues : {
      ':propertyId' : `PROPERTY#${propertyId}`,
    }
  }).promise()
  .then((response) => {
    return response.Items?.[0] ? parseRecord(response.Items[0]) : null;
  });
}

export const createProperty = async (input: CreatePropertyInput, owner: User): Promise<Property> => {
  const propertyId = nanoid();

  const geoHash = S2Util.makeGeoHash(input.location);
  const hashKey = S2Util.makeHashKey(geoHash);

  const property: Property = {
    id: propertyId,
    name: input.name,
    country: input.country,
    city: input.city,
    location: input.location,
    owner: owner,
    numberOfRooms: input.numberOfRooms
  };

  return db.put({
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
  }).promise()
  .then(() => property);
}

export const searchProperties = async (input: SearchPropertiesInput): Promise<Property[]> => {
  const ranges = S2Util.getRangesForRadiusQuery(input);

  const promises: Promise<Property[]>[] = ranges.map(async range => {
    const hashKey = S2Util.makeHashKey(range.rangeMin).toString(10);
    
    const minRange = range.rangeMin.toString(10);
    const maxRange = range.rangeMax.toString(10);

    return db.query({
      TableName: 'homelike',
      IndexName: 'GSI2',
      KeyConditionExpression : 'GSI2_PK = :hashKey and GSI2_SK between :rangeMin and :rangeMax',  
      ExpressionAttributeValues : {
        ':hashKey' : `HASHKEY#${hashKey}`,
        ':rangeMin' : `GEOHASH#${minRange}`,
        ':rangeMax' : `GEOHASH#${maxRange}`
      }
    }).promise()
    .then((response) => (response.Items ?? []).map(parseRecord));
  });

  const results = await Promise.all(promises);
  const properties = ([] as Property[]).concat(...results);

  return S2Util.filterByRadius(properties, input)
}

const parseRecord = (record: DocumentClient.AttributeMap): Property => {
  return {
    id: record.PK.replace('PROPERTY#', ''),
    name: record.propertyName,
    country: record.location.split('#')[0],
    city: record.location.split('#')[1],
    location: JSON.parse(record.locationJson),
    owner: JSON.parse(record.ownerJson),
    numberOfRooms: record.numberOfRooms
  }
}
