import { PrismaClient } from '@prisma/client' // TO DELETE AFTER EDITING
const prisma = new PrismaClient() // TO DELETE AFTER EDITING

const Mutation = {
    createUser(_, {data}, {prisma}){
        return prisma.user.create({
            data
        })
    },
    createContent(_, {data, newEventData}, {pubsub, channels, prisma}){
        
    
    }
}

export default Mutation