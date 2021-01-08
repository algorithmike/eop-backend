import { GraphQLServer } from 'graphql-yoga'
import { dummyUsers, dummyContent } from './dummyData'

// Next:
// Add content: [Content!]! to User.
// add postedBy: User! to Content.
// create Event type, query, resolver.
// add event: Event! to Content.
const typeDefs = `
  type Query {
    users: [User!]!
    content: [Content!]!
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
    postedAt: Int!
    postedBy: User!
    postedFromEop: Boolean!
    media: String!
    mediaPreview: String!
    description: String!
  }
`

const resolvers = {
  Query: {
    users(){
      return dummyUsers
    },
    content(){
      return dummyContent
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