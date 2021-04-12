import "regenerator-runtime/runtime.js";
import "cross-fetch/polyfill";
import ApolloClient, { gql } from "apollo-boost";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Content", () => {
  test("Query all events, receive event data.", async () => {
    const queryEvents = gql`
      query {
        events {
          id
          organizer {
            id
          }
          content {
            id
          }
        }
      }
    `;
    const results = await client.query({
      query: queryEvents,
    });

    expect(results.data.events).toBeTruthy();
  });
});
