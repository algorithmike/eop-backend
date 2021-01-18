const User = {
    content(parent, __, {prisma}){
        return prisma.content.findMany({
            where: {
                authorId: parent.id
            }
        })
    },
    events: async (parent, __, {prisma}) => {
        const result = await prisma.event.findMany({
            include: {
                attendees: true
            }
        })
        result.forEach(item => {
            console.log(item)
        })
        return result
    }
}

export default User