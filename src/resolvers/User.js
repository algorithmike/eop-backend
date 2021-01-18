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
    events: async (parent, __) => {
        // This is completely wrong
        // const result = await prisma.event.findMany({
        //     include: {
        //         attendees: true
        //     }
        // })
        // result.forEach(item => {
        //     console.log(item)
        // })
        // return result
        const events = await prisma.event.findMany({
            where: {
                attendees: {
                    every: {
                        id: parent.id
                    }
                }
            }
        })

        return events
    }
}

export default User