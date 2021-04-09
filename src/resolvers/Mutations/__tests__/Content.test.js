import "regenerator-runtime/runtime.js";
import "cross-fetch/polyfill";
import ApolloClient, { gql } from "apollo-boost";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
});

describe("Content", () => {
  test("Query all content, receive all content data.", async () => {
    const queryContent = gql`
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
    `;
    await client.query({
      query: queryContent,
    });
  });
});
