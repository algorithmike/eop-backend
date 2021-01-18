const User = {
    content({id}, __, {prisma}){
        return prisma.content.findMany({
            where: {
                authorId: id
            }
        })
    },
    eventsOrganized: async ({id}, __, {prisma}) => {
        return prisma.event.findMany({
            where: {
                organizerId: id
            }
        })
    }
}

export default User