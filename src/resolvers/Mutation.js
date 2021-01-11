import { nanoid } from 'nanoid'
import dayjs from 'dayjs'

const Mutation = {
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
}

export default Mutation