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
        // Delete content first.
        // Get an array of each of the eventID of eventsOrganized for user.
        // Delete user.
        // For each of the eventIDs, see if it has an associated author,
        // or any remaining associated content. If not, delete the event.
        if(!tokenData){
            throw new Error('Unauthorized action!')
        }

        // await prisma.content.deleteMany({
        //     where: { authorId: tokenData.id }
        // })

        const organizedEvents = await prisma.event.findMany({
            where: {organizerId: tokenData.id},
            select: {id: true}
        })

        console.log('organizedEvents: ', organizedEvents)
        return prisma.user.findUnique({
            where: {id: tokenData.id}
        })
    },
    deleteContent
}

export default Mutation