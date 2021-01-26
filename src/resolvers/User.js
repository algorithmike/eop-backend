const User = {
    content({id}, __, {prisma}){
        return prisma.user.findUnique({
            where: {
                id
            }
        }).content()
    },
    email(parent, _, {tokenData}){
        if(!tokenData) { return null }
        if(parent.id === tokenData.id){
            return parent.email
        } else {
            return null
        }
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