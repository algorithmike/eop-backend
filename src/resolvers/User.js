import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const User = {
    content(parent, __, {prisma}){
        return prisma.content.findMany({
            where: {
                authorId: parent.id
            }
        })
    },
    eventsOrganized: async ({id}, __) => {
        // To be verified
        return {}
    }
}

export default User