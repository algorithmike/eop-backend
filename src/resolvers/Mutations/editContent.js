const editContent = async (_, {edits}, {tokenData, prisma}) => {
    if(!tokenData){
        throw new Error('Invalid token!')
    }

    const {id, title, description, customDate, eventId} = edits
    const updates = {}
    const originalContent = await prisma.content.findUnique({
        where: {id}
    }).catch(() => {
        throw new Error('Unable to identify content.')
    })

    if(originalContent.authorId !== tokenData.id){
        throw new Error('Anauthorized action!')
    }
    if(title && title.length > 0){ updates.title = title }
    if(description){ updates.description = description }
    if(customDate && typeof customDate === 'number'){ updates.customDate = customDate }
    if(eventId){
        await prisma.event.findUnique({
            where: {id: eventId}
        }).then(result => {
            if(!result){
                throw new Error('Unable to update event.')
            }
            return result
        })
    }

    return prisma.content.update({
        where: {id},
        data: {
            ...updates,
            event: {
                connect: (eventId) ? {id: eventId} : false
            }
        }
    })
}

export default editContent