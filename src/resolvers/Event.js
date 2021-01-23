const Event = {
    content({id}, __, {prisma}){
        return prisma.content.findMany({
            where: {
                eventId: id
            }
        })
    },
    organizer({organizerId}, __, {prisma}){
        if(organizerId){
            return prisma.user.findFirst({
                where: {
                    id: organizerId
                }
            })
        }
        return undefined;
    }
}

export default Event