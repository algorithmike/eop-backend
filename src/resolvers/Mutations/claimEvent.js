const claimEvent = async (_, {eventId}, {tokenData, prisma}) => {
    if(!tokenData){
        throw new Error('Unauthorized action!')
    }

    const event = await prisma.event.findUnique({
        where: {id: eventId},
        include: {
            organizer: true
        }
    })

    if(event.organizer){
        throw new Error('Event is already claimed.')
    }

    return prisma.event.update({
        where: {id: eventId},
        data: {
            organizer: {
                connect: {
                    id: tokenData.id
                }
            }
        }
    }).catch(() => {
        throw new Error('Unable to claim event.')
    })
}

export default claimEvent