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
    await prisma.content.deleteMany()
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
            country: 'Monterey',
            city: 'United States',
        }
    })

    const {id: content1_id} = await prisma.content.create({
        data: {
            mediaType: 'image',
            mediaUrl: 'https://avatarfiles.alphacoders.com/124/thumb-1920-124420.jpg',
            mediaPreviewUrl: 'https://avatarfiles.alphacoders.com/124/thumb-1920-124420.jpg',
            title: 'Test Content One',
            author: {
                connect: {
                    id: user1_id
                }
            },
            event: {
                connect: {
                    id: event1_id
                }
            },
        }
    })

    const {id: content2_id} = await prisma.content.create({
        data: {
            mediaType: 'image',
            mediaUrl: 'https://avatarfiles.alphacoders.com/124/thumb-1920-124420.jpg',
            mediaPreviewUrl: 'https://avatarfiles.alphacoders.com/124/thumb-1920-124420.jpg',
            title: 'Test Content Two',
            author: {
                connect: {
                    id: user2_id
                }
            },
            event: {
                connect: {
                    id: event2_id
                }
            },
        }
    })

    const {id: content3_id} = await prisma.content.create({
        data: {
            mediaType: 'image',
            mediaUrl: 'https://avatarfiles.alphacoders.com/124/thumb-1920-124420.jpg',
            mediaPreviewUrl: 'https://avatarfiles.alphacoders.com/124/thumb-1920-124420.jpg',
            title: 'Test Content Three',
            author: {
                connect: {
                    id: user2_id
                }
            },
            event: {
                connect: {
                    id: event1_id
                }
            },
        }
    })
})

afterAll( async () => {
    // Exit prisma.
    await prisma.$disconnect()
})

describe('Users', () => {
    test('Query all users, receive all user data.', async () => {
        const queryUsers = gql`
            query {
                content {
                    id
                    title
                    mediaType
                    mediaUrl
                    mediaPreviewUrl
                    description
                }
            }
        `
        const result = await client.query({
            query: queryUsers
        })
    })

    test('Query one user, receive user data.', async () => {
        const {id} = await prisma.user.findUnique({
            where: {username: 'usertest_username1'}
        })
        
        const queryOneUser = gql`
            query oneUser($id: String!){
                oneUser(id: $id){
                    id
                    username
                    email
                }
            }
        `
        const result = await client.query({
            query: queryOneUser,
            variables: {
                id
            }
        })

        expect(result.data.oneUser.username).toBe('usertest_username1')
    })


    test('Create user, receive user data.', async () => {
        const createUser = gql`
            mutation {
                createUser (
                    data: {
                        email: "test@email.com"
                        username: "Test User"
                        password: "testPassword123"
                    }
                ){
                    token
                }
            }
        `

        await client.mutate({
            mutation: createUser
        })

        const testUser = await prisma.user.findUnique({
            where: {email: "test@email.com"}
        })
        expect(testUser.email).toBe('test@email.com')
    })

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

        const result = await client.mutate({
            mutation: login
        })

        jwt.verify(result.data.login.token, process.env.JWT_SECRET)
    })

    // test('Incorrectly login user, token rejected.', () => {
    //     const login = gql`
    //         mutation {
    //             login (
    //                 email: "user.test.two2@email.com",
    //                 password: "wrongPassword"
    //             ){
    //                 token
    //             }
    //         }
    //     `

    //     expect(client.mutate({mutation: login}))
    //         .rejects
    //         .toThrow()
    // })
})