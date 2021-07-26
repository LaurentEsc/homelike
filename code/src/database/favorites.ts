import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Favorite, Property, User } from "../types";
import { db } from "../utils/db";

export const markPropertyAsFavorite = async (user: User, property: Property): Promise<Favorite> => {
  const favorite: Favorite = {
    user,
    property
  };

  return db.put({
    TableName: 'homelike',
    Item: {
      PK: `PROPERTY#${property.id}`,
      SK: `FAVORITE#${property.id}#${user.userId}`,
      GSI1_PK: `USER#${user.userId}`,
      GSI1_SK: `FAVORITE#${property.id}#${user.userId}`,
      userJson: JSON.stringify(user),
      propertyJson: JSON.stringify(property),
    },
  })
  .promise()
  .then(() => favorite);
}

export const getFavoritesByUser = async (user: User): Promise<Favorite[]> => {
  return db.query({
    TableName: 'homelike',
    IndexName: 'GSI1',
    KeyConditionExpression : 'GSI1_PK = :userId and begins_with(GSI1_SK, :favorite)',  
    ExpressionAttributeValues : {
      ':userId' : `USER#${user.userId}`,
      ':favorite' : `FAVORITE`
    }
  })
  .promise()
  .then((response) => (response.Items ?? []).map(parseRecord));
}

const parseRecord = (record: DocumentClient.AttributeMap): Favorite => {
  return {
    user: JSON.parse(record.userJson),
    property: JSON.parse(record.propertyJson),
  }
}
