import "regenerator-runtime/runtime.js"
import { ApolloServer, PubSub } from 'apollo-server-express'
import express from 'express'
import expressJwt from 'express-jwt'
import { PrismaClient } from '@prisma/client'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Content from './resolvers/Content'
import Event from './resolvers/Event'
import Subscription, {ALL_CONTENT, ALL_EVENTS} from './resolvers/Subscription'
import typeDefs from './schema'

const pubsub = new PubSub()
const prisma = new PrismaClient()
const app = express()

// Decodes the token form the "Authorization" header of an incoming request,
// and adds it to the "req" object as "user" property, as used in the context object.
app.use(
  expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    credentialsRequired: false
  })
)

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
  context: ({req}) => ({
    tokenData: (req.user || null),
    pubsub,
    prisma,
    channels: {
      ALL_CONTENT,
      ALL_EVENTS
    }
  })
})

server.applyMiddleware({ app })

app.listen({ port: process.env.PORT || 4000 }, () => {
    if(!process.env.PORT){
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    }
  }
)