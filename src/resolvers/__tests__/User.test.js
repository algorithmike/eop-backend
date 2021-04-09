import "regenerator-runtime/runtime.js";
import "cross-fetch/polyfill";
import ApolloClient, { gql } from "apollo-boost";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

import seed from "../../utils/seed";

const prisma = new PrismaClient();

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
});

beforeAll(async () => {
  jest.setTimeout(10000);
  await seed();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Users", () => {
  test("Query one user, receive user data.", async () => {
    const { id } = await prisma.user.findUnique({
      where: { username: "usertest_username1" },
    });

    const queryOneUser = gql`
      query oneUser($id: String!) {
        oneUser(id: $id) {
          id
          username
          email
        }
      }
    `;
    const result = await client.query({
      query: queryOneUser,
      variables: {
        id,
      },
    });

    expect(result.data.oneUser.username).toBe("usertest_username1");
  });

  test("Create user, receive user data.", async () => {
    const createUser = gql`
      mutation {
        createUser(
          data: {
            email: "test@email.com"
            username: "Test User"
            password: "testPassword123"
          }
        ) {
          token
        }
      }
    `;

    await client.mutate({
      mutation: createUser,
    });

    const testUser = await prisma.user.findUnique({
      where: { email: "test@email.com" },
    });
    expect(testUser.email).toBe("test@email.com");
  });

  test("Login user, token verified.", async () => {
    const login = gql`
      mutation {
        login(email: "user.test.two2@email.com", password: "testPassword123") {
          token
        }
      }
    `;

    const result = await client.mutate({
      mutation: login,
    });

    jwt.verify(result.data.login.token, process.env.JWT_SECRET);
  });
});
