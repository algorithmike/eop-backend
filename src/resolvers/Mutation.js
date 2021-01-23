import login from './Mutations/login'
import createUser from './Mutations/createUser'
import createContent from './Mutations/createContent'
import createEvent from './Mutations/createEvent'
import editUser from './Mutations/editUser'
import editContent from './Mutations/editContent'

import { PrismaClient } from '@prisma/client' // To be deleted from this module after refactoring
const prisma = new PrismaClient() // To be deleted from this module after refactoring

const Mutation = {
    login,
    createUser,
    createContent,
    createEvent,
    claimEvent: async (_, {eventId}, {tokenData}) => {
        // To be tested:
        // If event has no organizer,
        // connect event with organizer if the organizer has content for the event.
        // Else throw error.
        
        const event = await prisma.event.findUnique({
            where: {id: eventId},
            include: {
                organizer: true
            }
        })

        if(event.organizer){
            throw new Error('Event is already claimed.')
        }

        return prisma.event.update({
            where: {id: eventId},
            data: {
                organizer: {
                    connect: {
                        where: {id: tokenData.id}
                    }
                }
            }
        }).catch(() => {
            throw new Error('Unable to claim event.')
        })
    },
    editUser,
    editContent,
    editEvent: () => {
        // Verify that the event is organized by user.
        // Optionally edit all fields
    },
    deleteUser: () => {
        // Delete current user, their content, and disassociate or delete their events
        // based on conditions of other people's content connected with it.
    },
    deleteContent: () => {
        // Verify content is authorized by user.
        // Delete content.
        // If the associated event has no organizer or other content, delete that event.
    },
    deleteEvent: (parent, args, {tokenData}) => {
        // Verify that the event is organized by user.
        // If the event has content associated with it, disassociate organizer from event.
        // Else delete event.


    }
}

export default Mutation