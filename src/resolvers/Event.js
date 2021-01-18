import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const Event = {
    content({id}, __, {prisma}){
        return prisma.content.findMany({
            where: {
                eventId: id
            }
        })
    },
    organizer({id}, __, {prisma}){
    
    }
}

export default Event