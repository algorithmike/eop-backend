const Content = {
    author({author}, __, {prisma}){
        return prisma.user.findMany({
            where: {
                id: author
            }
        })
    },
    event({event}, __, {prisma}){
        // return db.eventData.find(e => e.id === event)
        return prisma.event.findMany({
            where: {

            }
        })
    }
}

export default Content