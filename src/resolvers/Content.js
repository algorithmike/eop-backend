const Content = {
    author({authorId}, __, {prisma}){
        return prisma.user.findFirst({
            where: {
                id: authorId
            }
        })
    },
    event({eventId}, __, {prisma}){
        return prisma.event.findFirst({
            where: {
                id: eventId
            }
        })
    }
}

export default Content