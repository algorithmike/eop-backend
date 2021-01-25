const createContent = async (_, {data, newEventData = {}}, {prisma, tokenData} ) => {
    if(!tokenData){
        throw new Error('Unauthorized action!')
    }

    const {
        mediaType, mediaUrl,
        mediaPreviewUrl, title = '',
        description = '', postedFromEop = false,
        coordinates } = data
    let {eventId} = data
    const authorId = tokenData.id

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
    return await prisma.content.create({
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
}

export default createContent