import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Content from './resolvers/Content'
import Event from './resolvers/Event'
import Subscription, {ALL_CONTENT, ALL_EVENTS} from './resolvers/Subscription'

// Next:
// createUser Mutation
// editUser Mutation
// editContent Mutation
// editEvent Mutation; Only events created from own Content creation.
// deleteUser Mutation
// deleteContent Mutation

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    User,
    Content,
    Event,
    Subscription
  },
  context: {
    db,
    pubsub,
    channels: {
      ALL_CONTENT,
      ALL_EVENTS
    }
  }
})
server.start(() => console.log('Server is running on localhost:4000'))