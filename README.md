# eop-backend

## Need To Do:
* add validation for email field

## Important but not critical:
* Prisma, in how it's currently implemented, is causing an n + 1 problem... sending too many queries to the database when utilizing child resolvers from query.

## Nice to haves, but not of immediate priority:
* Switch to GCP Storage
* Auto country, state, city, landmark detection based off of coordinates.
* Create DateTime scalar type for DateTime in schema.graphql
* Add ability to create event while editing content, such that were the user to wish to change the event associated with their content, they may create a new event rather than choosing an already existing one.

## Questionable improvements or adjustments:
* Limit the ability to edit coordinates, title, or other fields of the event for all users, or conditionally.