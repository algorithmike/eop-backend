import { ApolloServer, PubSub } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import expressJwt from 'express-jwt'
import { Storage } from '@google-cloud/storage'
import path from 'path'
import { PrismaClient } from '@prisma/client'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Content from './resolvers/Content'
import Event from './resolvers/Event'
import Subscription, {ALL_CONTENT, ALL_EVENTS} from './resolvers/Subscription'
import typeDefs from './schema'

// For GC content bucket
const gc = new Storage()
const bucket = gc.bucket('eop-content')

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
    bucket,
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

export default app