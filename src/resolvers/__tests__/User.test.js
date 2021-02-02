import 'regenerator-runtime/runtime.js'
import 'cross-fetch/polyfill'
import ApolloClient, { gql } from 'apollo-boost';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql'
});

beforeAll( async () => {
    // Clear all records.
    await prisma.content.deleteMany()
    await prisma.event.deleteMany()
    await prisma.user.deleteMany()
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
    //                     email: "test@email.com"
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

    //     expect(testDuplicateEmailError).toThrowError(/email/)
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

        console.log('queryUsers: ', result)
    })
})