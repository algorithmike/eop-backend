import claimEvent from './Mutations/claimEvent'
import createContent from './Mutations/createContent'
import createEvent from './Mutations/createEvent'
import createUser from './Mutations/createUser'
import deleteContent from './Mutations/deleteContent'
import deleteEvent from './Mutations/deleteEvent'
import editContent from './Mutations/editContent'
import editEvent from './Mutations/editEvent'
import editUser from './Mutations/editUser'
import login from './Mutations/login'

import { PrismaClient } from '@prisma/client' // To be deleted from this module after refactoring
const prisma = new PrismaClient() // To be deleted from this module after refactoring

const Mutation = {
    claimEvent,
    createContent,
    createEvent,
    createUser,
    deleteEvent,
    editContent,
    editEvent,
    editUser,
    login,
    deleteUser: async (_, __, {tokenData}) => {
        if(!tokenData){
            throw new Error('Unauthorized action!')
        }

        // Delete this user's content.
        await prisma.content.deleteMany({
            where: { authorId: tokenData.id }
        })

        const organizedEvents = await prisma.event.findMany({
            where: {organizerId: tokenData.id},
            include: {content: true}
        })

        for(const event of organizedEvents){
        // Delete each of this user's events that doesn't have
        // any content left.
            if(event.content.length < 1){
                await prisma.event.delete({
                    where: {id: event.id}
                })
            }
        }

        // Delete this user.
        return prisma.user.delete({
            where: {id: tokenData.id}
        })
    },
    deleteContent
}

export default Mutation