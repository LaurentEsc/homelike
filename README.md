# Homelike

## Project features

* REST API for properties and favorites
* User management with AWS Cognito
* API routing with AWS Api Gateway
* Computing with AWS Lambda (Node.js)
* Data storage with AWS DynamoDB
* Infrastructure management with Terraform
* Radius-based geospatial search supported by Google's [S2 Geometry](https://s2geometry.io/) library
* Data modelling using DynamoDB's [single-table design](https://www.alexdebrie.com/posts/dynamodb-single-table/)

## API documentation

### Sign up

```
POST /sign-up

{
  "email": "john@email.com",
  "password": "your-password",
  "givenName: "John"
}
```

_Note that you'll receive a verification email in the process. You can ignore it._

### Sign in

```
POST /sign-in

{
  "email": "john@email.com",
  "password": "your-password",
}
```

_This request returns the `idToken` that you'll need to authenticate with the rest of the API._

### Create a new Property

```
POST /properties

{
  "name": "Cosy studio in the city center",
  "country": "DE",
  "city": "Cologne",
  "location": {
      "longitude": 50.93979502370754,
      "latitude": 6.934593964765874
  },
  "numberOfRooms": 1
}
```

_Authentication is required for this endpoint._

### Search Properties

```
GET /properties?...

{
  "longitude": 50.94170642954174,
  "latitude": 6.958322074883795,
  "radiusInMeters": 3000
}
```

### Mark Property as Favorite

```
POST /me/favorites

{
  "propertyId": "xxxxxxxxx",
}
```

_Authentication is required for this endpoint._

### List my Favorites

```
GET /me/favorites
```

_Authentication is required for this endpoint._

## Deployment

The app is running on my private AWS account and I am therefore not sharing any public access data here.

See the instructions below to deploy to your own AWS account:

### Requirements

* AWS CLI
* Terraform 1.0.2
* Node.js 14
* Npm 7

### AWS CLI configuration

* Replace `laurent` with your AWS profile name in the following files:
  * [code/makefile](https://github.com/LaurentEsc/homelike/blob/master/code/makefile)
  * [code/scripts/seed.ts](https://github.com/LaurentEsc/homelike/blob/master/code/scripts/seed.ts)
  * [infrastructure/providers.tf](https://github.com/LaurentEsc/homelike/blob/master/infrastructure/providers.tf)

### Deploy the infrastructure to AWS

```
cd infrastructure
terraform init
terraform apply
```

### Deploy the lambda functions code

```
cd code
npm ci
make prepare
make deploy
```

### Seed property data

```
cd code
node_modules/.bin/ts-node scripts/seed.ts
```

### Try it

* Find you API Gateway domain [in the AWS console](https://console.aws.amazon.com/apigateway) and use it to trigger the API.
* Here's a [Postman collection](https://www.getpostman.com/collections/9bef70812eb1a22cfabb) that should help. Take notice of the two environment variables `api_url` and `id_token`.

## Known issues and limitations

* No handling for DynamoDB's query response pagination
* No pagination supported for the `GET /properties` request
* No pagination supported for the `GET /me/favorites` request
* Limited error handling
* Limited test coverage