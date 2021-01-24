const deleteEvent = async (_, {eventId}, {tokenData, prisma}) => {
    if(!tokenData){
        throw new Error('Unauthorized action!')
    }

    const event = await prisma.event.findFirst({
        where: {
            AND: [
                {id: eventId},
                {organizerId: tokenData.id}
            ]
        }, include: {
            content: true
        }
    }).then(result => {
        if(!result){
            throw new Error('Unable to identify event.')
        }
        return result
    })

    if(event.content.length > 0){
        return prisma.event.update({
            where: {
                id: eventId
            },
            data: {
                organizer: {
                    disconnect: true
                }
            }
        })
    }
    
    return prisma.event.delete({
        where: {
            id: eventId
        }
    })
}

export default deleteEvent