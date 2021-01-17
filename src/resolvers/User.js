const User = {
    content({id}, __, {prisma}){
        return prisma.content.findMany({
            where: {
                authorId: id
            }
        })
    },
    events({id}, __, {prisma}){
        return prisma.event.findMany({
            where: {
                attendees: {
                    every: {
                        id: {
                            equals: id
                        }
                    }
                }
            }
        })
    }
}

export default User