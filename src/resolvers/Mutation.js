import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const Mutation = {
    createUser: async (_, {data}, {pubsub, channels}) => {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    { username: data.username }
                ]
            }
        })

        if(existingUser){
            throw new Error('That email or username is already in use.')
        }

        return await prisma.user.create({data})
    },
    createContent: async (_, {data, newEventData}, {pubsub, channels, prisma}) => {
        const {mediaType, mediaUrl, title, description, eventId,  postedFromEop = false, authorId, coordinates} = data
        
        const prismaAuthor = await prisma.user.findFirst({
            where: {id: authorId}
        })

        if(!prismaAuthor){
            throw new Error('Invalid user.')
        }

        if(!eventId){
            // Create new event if new content is not related to one.
            if(!coordinates){
                throw new Error('Location has not been provided.')
            }

            const {
                title = '',
                description = '',
                country = '',
                state = '',
                city = '',
                landmark = ''
            } = newEventData

            const createdEvent = await prisma.event.create({
                title, description, country, state, city, landmark, coordinates
            })

            eventId = createdEvent.id

        } else {
            // Verify that the event is valid.
            const prismaEvent = await prisma.event.findFirst({
                where: {id: eventId}
            })
            if(!prismaEvent){
                throw new Error('Invalid event.')
            }
        }

        const createdContent = await prisma.content.create({
            mediaType,
            mediaUrl,
            title,
            postedFromEop,
            authorId,
            description,
            eventId
        })
        return createdContent
    }
}

export default Mutation