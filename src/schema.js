import { gql } from "apollo-server"

const typeDefs = gql`
    type Query {
        users(text: String): [User!]!
        oneUser(id: String!): User!
        content(text: String): [Content!]!
        oneContent(id: String!): Content!
        events(text: String): [Event!]!
        oneEvent(id: String!): Event!
    }

    type Mutation {
        createUser(data: CreateUserInput!): User!
        createContent(
            data: CreateContentInput!, 
            newEventData: CreateContentInput_event
            ): Content!
        createEvent (data: CreateEventInput!): Event!
    }

    type Subscription {
        content: ContentPubSub
        events: EventPubSub
    }

    type ContentPubSub {
        mutation: MUTATION_TYPE!
        data: Content!
    }

    type EventPubSub {
        mutation: MUTATION_TYPE!
        data: Event!
    }

    input CreateUserInput {
        email: String!
        username: String!
        password: String!
        realname: String
        description: String
        profilePicUrl: String
    }

    input CreateContentInput {
        mediaType: String!
        mediaUrl: String!
        mediaPreviewUrl: String!
        title: String!
        authorId: String!
        coordinates: String!
        description: String
        postedFromEop: Boolean
        eventId: String
    }

    input CreateContentInput_event {
        title: String
        description: String
        country: String
        state: String
        city: String
        landmark: String
    }

    input CreateEventInput {
        title: String!
        coordinates: String!
        organizerId: String!
        description: String
        country: String
        state: String
        city: String
        landmark: String
    }

    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        realname: String
        description: String
        profilePicUrl: String
        content: [Content!]!
        eventsOrganized: [Event!]!
    }

    type Content {
        id: ID!
        mediaType: String!
        title: String!
        createdAt: Float!
        postedFromEop: Boolean!
        mediaUrl: String!
        mediaPreviewUrl: String!
        description: String
        author: User!
        event: Event!
    }

    type Event {
        id: ID!
        title: String!
        coordinates: String!
        description: String
        country: String
        state: String
        city: String
        landmark: String
        organizer: User!
        content: [Content!]!
    }

    enum MUTATION_TYPE {
        CREATED
        UPDATED
        DELETED
    }
`
export default typeDefs