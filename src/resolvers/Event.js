const Event = {
    content({id}, __, {prisma}){
        return prisma.content.findMany({
            where: {
                eventId: id
            }
        })
    },
    organizer({organizerId}, __, {prisma}){
        return prisma.user.findFirst({
            where: {
                id: organizerId
            }
        })
    }
}

export default Event