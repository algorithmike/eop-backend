import { ApolloServer, PubSub } from 'apollo-server'
import { PrismaClient } from '@prisma/client'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Content from './resolvers/Content'
import Event from './resolvers/Event'
import Subscription, {ALL_CONTENT, ALL_EVENTS} from './resolvers/Subscription'
import typeDefs from './schema'

// Next:
// editUser Mutation
// editContent Mutation
// editEvent Mutation
// deleteUser Mutation
// deleteContent Mutation

const pubsub = new PubSub()
const prisma = new PrismaClient()

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    User,
    Content,
    Event,
    Subscription
  },
  context: {
    pubsub,
    prisma,
    channels: {
      ALL_CONTENT,
      ALL_EVENTS
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})