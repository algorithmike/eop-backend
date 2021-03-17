import path from 'path'

const deleteContent = async (_, {contentId}, {tokenData, space, prisma}) => {
    if(!tokenData){
        throw new Error('Unauthorized action!')
    }
    
    const content = await prisma.content.findFirst({
        where: {
            AND: [
                {id: contentId},
                {authorId: tokenData.id}
            ]
        },
        include: {
            event: {
                select: {content: true}
            }
        }
    }).then(result => {
        if(!result){
            throw new Error('Unable to identify content.')
        }
        return result
    })

    const Bucket = (content.mediaType === 'image') ? 'eop-pic-bucket' : 'eop-video-bucket'
    const Key = path.basename(content.mediaUrl)

    await new Promise((resolve) => {
        space.deleteObject({
          Bucket, 
          Key
        }, (err) => {
          if (err) {
            console.log('Item could not be deleted!');
            throw new Error(err)
          }else{
              resolve()
          }
        })
    })

    if(content.event.content.length > 1){
    // Delete the content records from db, but don't delete the event if it has other associated content.
        return prisma.content.delete({
            where: { id: contentId }
        })
    }

    // Delete the content AND the event.
    const deletedContent = prisma.content.delete({
        where: {id: contentId}
    })

    const deletedEvent = prisma.event.delete({
        where: {
            id: content.eventId
        }
    })
    
    // This implementation will throw error if the return value
    // requires any non-scalar fields such as "author" or "event".
    // Possible workaround would be to eager-load the non-scalar fields,
    // but that's a hit on performance.
    const result = await prisma.$transaction([deletedContent, deletedEvent])
    return result[0]
}

export default deleteContent