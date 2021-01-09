import { GraphQLServer } from 'graphql-yoga'
import { dummyUsers, dummyContent, dummyEvents } from './dummyData'

// Next:
// add events: [Event!]! to User.
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
    events: [Event!]!
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
    event: Event!
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
    content: [Content!]!
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
    content({id}){
      return dummyContent.filter(contentItem => contentItem.postedBy === id)
    },
    events({id}){
      let eventsFromContent =
        dummyContent.filter(contentItem => contentItem.postedBy === id)

      return dummyEvents.filter(event => {
        return eventsFromContent.some(matcher => matcher.event === event.id)
      })
    }
  },
  Content: {
    postedBy({postedBy}){
      return dummyUsers.find(user => user.id === postedBy)
    },
    event({event}){
      return dummyEvents.find(event => event === event.id)
    }
  },
  Event: {
    content({id}){
      return dummyContent.filter(contentItem => contentItem.event === id)
    }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log('Server is running on localhost:4000'))