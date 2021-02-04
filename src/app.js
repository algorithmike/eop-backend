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
const keyFileName = (process.env.NODE_ENV === 'production')
  ? '../gckey.json' : '../key.json'
const gc = new Storage({
    keyFilename: path.join(__dirname, keyFileName),
    projectId: process.env.GC_PROJECT_ID
})
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

// Cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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