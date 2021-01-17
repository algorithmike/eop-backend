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
    attendees({id}, __, {prisma}){
        // This is completely wrong
        return prisma.user.findMany({
            where: {
                events: {
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

export default Event