const Content = {
    author({author}, __, {prisma}){
        return prisma.user.findFirst({
            where: {
                id: author
            }
        })
    },
    event({event}, __, {prisma}){
        // return db.eventData.find(e => e.id === event)
        return prisma.event.findFirst({
            where: {
                id: event
            }
        })
    }
}

export default Content