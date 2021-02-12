import { gql } from "apollo-server-express"

const typeDefs = gql`
    type Query {
        users(filter: FilterInput): [User!]!
        oneUser(id: String!): User!
        content(filter: FilterInput): [Content!]!
        oneContent(id: String!): Content!
        events(filter: FilterInput): [Event!]!
        oneEvent(id: String!): Event!
    }

    type Mutation {
        login(email: String!, password: String!): AuthPayload!
        createUser(data: CreateUserInput!): AuthPayload!
        createContent(
            data: CreateContentInput!, 
            newEventData: CreateContentInput_event
            ): Content!
        createEvent(data: CreateEventInput!): Event!
        claimEvent(eventId: String!): Event!
        editUser(edits: EditUserInput!): User!
        editContent(edits: EditContentInput!): Content!
        editEvent(edits: EditEventInput!): Event!
        deleteUser: User!
        deleteContent(contentId: String!): Content!
        deleteEvent(eventId: String!): Event!
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

    type AuthPayload {
        token: String!
        username: String!
        email: String!
        realname: String
        description: String
        profilePicUrl: String
    }

    input CreateUserInput {
        email: String!
        username: String!
        password: String!
        realname: String
        description: String
        profilePicUrl: String
    }

    input FilterInput {
        text: String
        take: Int
        skip: Int
        cursor: String
        orderBy: FilterInput_orderBy
    }

    input FilterInput_orderBy {
        key: String!
        direction: SORT_DIRECTION!
    }

    input EditUserInput {
        email: String
        username: String
        password: String
        realname: String
        description: String
        profilePicUrl: String
    }

    input CreateContentInput {
        file: Upload!
        title: String!
        coordinates: String!
        description: String
        postedFromEop: Boolean
        customDate: Float
        eventId: String
    }

    input EditContentInput {
        id: ID!
        title: String
        description: String
        customDate: Float
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
        description: String
        country: String
        state: String
        city: String
        landmark: String
    }

    input EditEventInput {
        eventId: String!
        title: String
        coordinates: String
        description: String
        country: String
        state: String
        city: String
        landmark: String
    }

    type User {
        id: ID!
        username: String!
        email: String
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
        updatedAt: Float!
        postedFromEop: Boolean!
        mediaUrl: String!
        mediaPreviewUrl: String!
        description: String
        customDate: Float
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
        organizer: User
        content: [Content!]!
    }

    enum MUTATION_TYPE {
        CREATED
        UPDATED
        DELETED
    }

    enum SORT_DIRECTION {
        asc
        desc
    }
`
export default typeDefs