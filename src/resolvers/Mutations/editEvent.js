const editEvent = async (_, {edits}, {tokenData, prisma}) => {
    if(!tokenData){
        throw new Error('Unauthorized action!')
    }
    const event = await prisma.event.findFirst({
        where: {
            AND: [
                {organizerId: tokenData.id},
                {id: edits.eventId}
            ]
        }
    }).then(result => {
        if(!result){
            throw new Error('Unable to identify event.')
        }
        return result
    })

    if(Object.keys(edits).length > 1){
        const {eventId} = edits
        delete edits.eventId

        return prisma.event.update({
            where: {
                id: eventId
            },
            data: {...edits}
        })
    }
    throw new Error('No updates were declared.')
}

export default editEvent