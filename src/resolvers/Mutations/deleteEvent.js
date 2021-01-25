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
        // If the event has any content in it, don't delete the event,
        // rather just disassociate the event from the organizer
        // so that the content can continue to exist with event.
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
    } else {
        return prisma.event.delete({
            where: {
                id: eventId
            }
        })
    }
}

export default deleteEvent