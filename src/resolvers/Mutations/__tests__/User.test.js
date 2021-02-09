import 'regenerator-runtime/runtime.js'
import 'cross-fetch/polyfill'
import ApolloClient, { gql } from 'apollo-boost';
import { PrismaClient } from '@prisma/client'

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
})

afterAll( async () => {
    // Exit prisma.
    await prisma.$disconnect()
})

describe('Users', () => {
    test('Create user.', async () => {
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

    // test('Create user with duplicate email, throws error.', () => {
    //     const createUser = gql`
    //         mutation {
    //             createUser (
    //                 data: {
    //                     email: "test@duplicate.com"
    //                     username: "Test User"
    //                     password: "testPassword123"
    //                 }
    //             ){
    //                 token
    //             }
    //         }
    //     `

    //     const testDuplicateEmailError = () => {
    //         client.mutate({mutation: createUser})
    //     }

    //     expect(testDuplicateEmailError).toThrowError()
    // })

    test('Query all users.', async () => {
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
})