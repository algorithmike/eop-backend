import 'regenerator-runtime/runtime.js'
import 'cross-fetch/polyfill'
import ApolloClient, { gql } from 'apollo-boost';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql'
});

describe('Query', () => {
    test('all users.', async () => {
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
        await client.query({
            query: queryUsers
        })
    })
})