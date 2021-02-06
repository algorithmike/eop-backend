import { ApolloServer, PubSub } from 'apollo-server-express'
import AWS from 'aws-sdk'
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

const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_ENDPOINT);
const space = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET
})

const pubsub = new PubSub()
const prisma = new PrismaClient()

const app = express()

// app.use(cors())

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
  introspection: true, // In full release, it's best practice to disable this.
  playground: true, // In full release, it's best practice to disable this.
  context: ({req}) => ({
    channels: {
      ALL_CONTENT,
      ALL_EVENTS
    },
    prisma,
    pubsub,
    space,
    tokenData: (req.user || null)
  })
})

server.applyMiddleware({ app })

export default app