import 'regenerator-runtime/runtime.js'
import 'cross-fetch/polyfill'
import ApolloClient, { gql } from 'apollo-boost';
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken';

import hashPassword from '../../../utils/hashPassword'

const prisma = new PrismaClient();

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql'
});

beforeAll( async () => {
    // Clear all records.
    await prisma.event.deleteMany()
    await prisma.user.deleteMany()

    // Seed users.
    const {id: user1_id} = await prisma.user.create({
        data: {
            email: 'user.test.one1@email.com',
            username: 'usertest_username1',
            password: await hashPassword('testPassword123'),
            realname: 'User Test 1',
            description: 'This is the first user tester.',
            profilePicUrl: 'https://i.pinimg.com/564x/4d/f1/93/4df193b6dc700bd806fc0273506f8587.jpg'
        }
    })

    const {id: user2_id} = await prisma.user.create({
        data: {
            email: 'user.test.two2@email.com',
            username: 'usertest_username2',
            password: await hashPassword('testPassword123'),
            realname: 'User Test 2',
            description: 'This is the second user tester.',
            profilePicUrl: 'https://i.pinimg.com/564x/4d/f1/93/4df193b6dc700bd806fc0273506f8587.jpg'
        }
    })

    // Seed events.
     // coordinates = 'Latitude: 37.42342342342342, Longitude: -122.08395287867832'

    const {id: event1_id} = await prisma.event.create({
        data: {
            organizer: {
                connect: {
                    id: user1_id
                }
            },
            coordinates: 'Latitude: 37.42342342342342, Longitude: -122.08395287867832',
            title: 'Event One Title',
            description: 'This is a description for the first event.',
            country: 'USA',
            state: 'NV',
            city: 'Reno',
            landmark: 'Circus Circus'
        }
    })
    const {id: event2_id} = await prisma.event.create({
        data: {
            organizer: {
                connect: {
                    id: user2_id
                }
            },
            coordinates: 'Latitude: 36.6002, Longitude: -121.8947',
            title: 'Event Two Title',
            description: 'This is a description for the second event.',
            country: 'United States',
            city: 'Monterey',
        }
    })
})

afterAll( async () => {
    // Exit prisma.
    await prisma.$disconnect()
})

describe('Events', () => {
    test('Login user, token verified.', async () => {
        const login = gql`
            mutation {
                login (
                    email: "user.test.two2@email.com",
                    password: "testPassword123"
                ){
                    token
                }
            }
        `

        const queryOneUser = gql`
        query eventsInProximity($coordinates: String!){
            eventsInProximity(coordinates: $coordinates){
                title
                coordinates
                country
                state
                city
                landmark
            }
        }
        `

        const result = await client.mutate({
            mutation: login
        })

        jwt.verify(result.data.login.token, process.env.JWT_SECRET)
    })
})