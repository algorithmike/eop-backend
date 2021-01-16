# eop-backend

## Need To Do
* Since the ids will be generated in prisma, remove nanoid dependency and its usage in the Mutation resolvers, and verify its references.

### Nice to haves, but not of immediate priority:
* Ability to create future events, not yet associated with any content. Currently, events are only created as objects of data that define a time and location around a content item's creation.
* Auto country, state, city, landmark detection based off of coordinates.
* Create DateTime scalar type for DateTime in schema.graphql