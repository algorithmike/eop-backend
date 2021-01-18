const Mutation = {
    createUser: async (_, {data}, {prisma} ) => {
        const existingUsers = await prisma.user.count({
            where: {
                OR: [
                    { email: data.email },
                    { username: data.username }
                ]
            }
        })

        if(existingUsers > 0){
            throw new Error('That email or username is already in use.')
        }

        return await prisma.user.create({data})
    },
    createContent: async (_, {data, newEventData = {}}, {prisma} ) => {
        const {mediaType, mediaUrl, mediaPreviewUrl, title = '', description = '',  postedFromEop = false, authorId, coordinates} = data
        let {eventId} = data

        // Check if authorId is valid
        const prismaAuthor = await prisma.user.findFirst({
            where: {id: authorId}
        })
        if(!prismaAuthor){
            throw new Error('Invalid user.')
        }
        
        // Check if eventId is valid, if is provided for connection.
        if(eventId){
            const prismaEvent = await prisma.event.findFirst({
                where: {id: eventId}
            })
            if(!prismaEvent){
                throw new Error('Invalid event.')
            }
        } else {
            eventId = ''
        }

        // Check coordinates
        if(!coordinates){
            throw new Error('Location has not been provided.')
        }

        // Create content and connects it to existing event or creates new one.
        // If new event is created, connects event to organizer(User)
        const createdContent = await prisma.content.create({
            data: {
                mediaType,
                mediaUrl,
                mediaPreviewUrl,
                title,
                postedFromEop,
                author: {
                    connect: {
                        id: authorId
                    }
                },
                description: description,
                event: {
                    connectOrCreate: {
                        where: { id: eventId },
                        create: {
                            title: newEventData.title ? newEventData.title : 'Unnamed Event',
                            coordinates,
                            description: newEventData.description ? newEventData.description : '',
                            country: newEventData.country ? newEventData.country : '',
                            city: newEventData.city ? newEventData.city : '',
                            state: newEventData.state ? newEventData.state : '',
                            landmark: newEventData.landmark ? newEventData.landmark : '',
                            organizer: {
                                connect: {
                                    id: authorId
                                }
                            }
                        }
                    }
                }
            },
            include: {
                event: true
            }
        })
        return createdContent
    }
}

export default Mutation