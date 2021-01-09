import { GraphQLServer } from 'graphql-yoga'
import { dummyUsers, dummyContent, dummyEvents } from './dummyData'

// Next:
// add event: Event! to Content.
// add content: [Content!]! to Event.
// add eventsAttended: [Event!]! to User.
// add attendees: [User!]! to Event.
const typeDefs = `
  type Query {
    users: [User!]!
    content: [Content!]!
    events: [Event!]!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    realname: String
    description: String
    profilePic: String
    content: [Content!]!
  }

  type Content {
    id: ID!
    mediaType: String!
    title: String!
    postedAt: String!
    postedBy: User!
    postedFromEop: Boolean!
    media: String!
    mediaPreview: String!
    description: String!
  }

  type Event {
    id: ID!
    title: String!
    startedAt: String!
    coordinates: String!
    description: String
    country: String
    state: String
    city: String
    landmark: String
  }
`

const resolvers = {
  Query: {
    users(){
      return dummyUsers
    },
    content(){
      return dummyContent
    },
    events(){
      return dummyEvents
    }
  },
  User: {
    content(parent){
      return dummyContent.filter(contentItem => {
        return contentItem.postedBy === parent.id
      })
    }
  },
  Content: {
    postedBy(parent){
      return dummyUsers.find(user => {
        return user.id === parent.postedBy
      })
    }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log('Server is running on localhost:4000'))