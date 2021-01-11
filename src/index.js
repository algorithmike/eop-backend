import { GraphQLServer } from 'graphql-yoga'
import dayjs from 'dayjs'
import gql from 'graphql-tag'
import { nanoid } from 'nanoid'
import db from './db'


// Next:
// createUser Mutation
// editUser Mutation
// editContent Mutation
// editEvent Mutation; Only events created from own Content creation.
// deleteUser Mutation
// deleteContent Mutation
const typeDefs = gql`
  type Query {
    users(text: String): [User!]!
    content(text: String): [Content!]!
    events(text: String): [Event!]!
  }

  type Mutation {
    createContent(data: CreateContentInput!, newEventData: CreateContentInput_event): Content!
  }

  input CreateContentInput {
    mediaType: String!
    media: String!
    title: String!
    description: String!
    postedFromEop: Boolean!
    postedBy: String!
    coordinates: String!
    event: String
  }

  input CreateContentInput_event {
    title: String
    startedAt: Float
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
    profilePic: String
    content: [Content!]!
    events: [Event!]!
  }

  type Content {
    id: ID!
    mediaType: String!
    title: String!
    postedAt: Float!
    postedFromEop: Boolean!
    media: String!
    mediaPreview: String!
    description: String!
    postedBy: User!
    event: Event!
  }

  type Event {
    id: ID!
    title: String!
    startedAt: Float!
    coordinates: String!
    description: String
    country: String
    state: String
    city: String
    landmark: String
    content: [Content!]!
    attendees: [User!]!
  }
`

const resolvers = {
  Query: {
    users(_, {text}, {db}){
      if(text){
        return db.userData.filter(user => {
          return (
            user.username.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
            user.email.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
            user.realname.toLocaleLowerCase().includes(text.toLocaleLowerCase())
          )
        })
      }
      return db.userData
    },
    content(_, {text}, {db}){
      if(text){
        return db.contentData.filter(item => {
          return (
            item.title.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
            item.description.toLocaleLowerCase().includes(text.toLocaleLowerCase())
          )
        })
      }
      return db.contentData
    },
    events(_, {text}, {db}){
      if(text){
        return db.eventData.filter(event => {
          return (
            event.title.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
            event.description.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
            event.landmark.toLocaleLowerCase().includes(text.toLocaleLowerCase())
          )
        })
      }
      return db.eventData
    }
  },
  Mutation: {
    createContent(_, {data, newEventData}, {db}){
      const { mediaType, title, description, postedFromEop, postedBy, coordinates, event } = data
      const postedAt = dayjs().valueOf()
      const newContent = { mediaType, title, description, postedFromEop, postedBy, postedAt, event } 

      if(!newContent.event){
        const newEvent = (newEventData) ?
          {
            title: (newEventData.title) ? newEventData.title : 'Unnamed Event',
            startedAt: newEventData.startedAt ? newEventData.startedAt : postedAt,
            description: newEventData.description ? newEventData.description : '',
            country: newEventData.country ? newEventData.country : '',
            state: newEventData.state ? newEventData.state : '',
            city: newEventData.city ? newEventData.city : '',
            coordinates,
            id: nanoid()
          } : {
            title: 'Unnamed Event',
            startedAt: '',
            description: '',
            country: '',
            state: '',
            city: '',
            coordinates,
            id: nanoid()
          }

        db.eventData.push(newEvent)
        newContent.event = newEvent.id
      }

      db.contentData.push(newContent)
      return newContent
    }
  },
  User: {
    content({id}, __, {db}){
      return db.contentData.filter(contentItem => contentItem.postedBy === id)
    },
    events({id}, __, {db}){
      let thisUserContent =
        db.contentData.filter(contentItem => contentItem.postedBy === id)

      return db.eventData.filter(event => {
        return thisUserContent.some(content => content.event === event.id)
      })
    }
  },
  Content: {
    postedBy({postedBy}, __, {db}){
      return db.userData.find(user => user.id === postedBy)
    },
    event({event}, __ {db}){
      return db.eventData.find(e => e.id === event)
    }
  },
  Event: {
    content({id}, __, {db}){
      return db.contentData.filter(contentItem => contentItem.event === id)
    },
    attendees({id}, __, {db}){
      let contentFromThisEvent = db.contentData.filter(contentItem => {
        return id === contentItem.event
      })

      return db.userData.filter(user => {
        return contentFromThisEvent.some(content => content.postedBy === user.id)
      })
      
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: {
    db
  }
})
server.start(() => console.log('Server is running on localhost:4000'))