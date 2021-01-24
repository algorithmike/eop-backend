import claimEvent from './Mutations/claimEvent'
import createContent from './Mutations/createContent'
import createEvent from './Mutations/createEvent'
import createUser from './Mutations/createUser'
import deleteEvent from './Mutations/deleteEvent'
import editContent from './Mutations/editContent'
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
    editUser,
    login,
    editEvent: async (_, {edits}, {tokenData}) => {
        // Verify that the event is organized by user.
        // Optionally edit all fields
        if(!tokenData){
            throw new Error('Unauthorized action!')
        }
        const event = await prisma.event.findFirst({
            where: {
                AND: [
                    {organizerId: tokenData.id},
                    {id: edits.eventId}
                ]
            }
        }).then(result => {
            if(!result){
                throw new Error('Unable to identify event.')
            }
            return result
        })

        if(Object.keys(edits).length > 1){
            const {eventId} = edits
            delete edits.eventId

            return prisma.event.update({
                where: {
                    id: eventId
                },
                data: {...edits}
            })
        }
        throw new Error('No updates were declared.')
    },
    deleteUser: () => {
        // Delete current user, their content, and disassociate or delete their events
        // based on conditions of other people's content connected with it.
    },
    deleteContent: () => {
        // Verify content is authorized by user.
        // Delete content.
        // If the associated event has no organizer or other content, delete that event.
    }
}

export default Mutation