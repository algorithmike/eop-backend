# eop-backend

## Need To Do
* Create update and delete mutations.
* add validation for email field
* remove "password" field from data returned to user in queries
* figure out what to do with content when its associated event is deleted

## Important but not critical:
* Prisma, in how it's currently implemented, is causing an n + 1 problem... sending too many queries to the database when utilizing child resolvers from query.

## Nice to haves, but not of immediate priority:
* ~~Ability to create future events, not yet associated with any content. Currently, events are only created as objects of data that define a time and location around a content item's creation.~~
* Auto country, state, city, landmark detection based off of coordinates.
* Create DateTime scalar type for DateTime in schema.graphql