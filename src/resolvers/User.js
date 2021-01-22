const User = {
    content({id}, __, {prisma}){
        return prisma.user.findUnique({
            where: {
                id
            }
        }).content()
    },
    eventsOrganized: async ({id}, __, {prisma}) => {
        return prisma.user.findUnique({
            where: {
                id
            }
        }).eventsOrganized()
    }
}

export default User