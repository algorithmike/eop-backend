import { nanoid } from 'nanoid'
import dayjs from 'dayjs'

const Mutation = {
    createContent(_, {data, newEventData}, {db, pubsub, channels}){
        const { mediaType, title, description, postedFromEop, author, coordinates, event } = data
        const createdAt = dayjs().valueOf()
        const newContent = { mediaType, title, description, postedFromEop, author, createdAt, event } 

        if(!newContent.event){
        const newEvent = (newEventData) ?
            {
                title: (newEventData.title) ? newEventData.title : 'Unnamed Event',
                startedAt: newEventData.startedAt ? newEventData.startedAt : createdAt,
                description: newEventData.description ? newEventData.description : '',
                country: newEventData.country ? newEventData.country : '',
                state: newEventData.state ? newEventData.state : '',
                city: newEventData.city ? newEventData.city : '',
                coordinates,
                id: nanoid()
            } : {
                title: 'Unnamed Event',
                startedAt: 0,
                description: '',
                country: '',
                state: '',
                city: '',
                coordinates,
                id: nanoid()
            }

            db.eventData.push(newEvent)
            newContent.event = newEvent.id
            pubsub.publish(channels.ALL_EVENTS, {
                events: {
                    mutation: 'CREATED',
                    data: newEvent
                }
            })
        
        }
        newContent.id = nanoid()
        db.contentData.push(newContent)
        pubsub.publish(channels.ALL_CONTENT, {
            content: {
                mutation: "CREATED",
                data: newContent
            }
        })
        return newContent
    }
}

export default Mutation