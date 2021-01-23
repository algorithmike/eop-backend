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
    claimEvent: async (_, {eventId}, {tokenData, prisma}) => {
        if(!tokenData){
            throw new Error('Unauthorized action!')
        }

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
                        id: tokenData.id
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
    deleteEvent: async (_, {eventId}, {tokenData, prisma}) => {
        // Verify that the event is organized by user.

        if(!tokenData){
            throw new Error('Unauthorized action!')
        }

        const event = await prisma.event.findFirst({
            where: {
                AND: [
                    {id: eventId},
                    {organizerId: tokenData.id}
                ]
            }, include: {
                content: true
            }
        }).then(result => {
            if(!result){
                throw new Error('Unable to identify event.')
            }
            return result
        })

        if(event.content.length > 0){
            return prisma.event.update({
                where: {
                    id: eventId
                },
                data: {
                    organizer: {
                        disconnect: true
                    }
                }
            })
        }
        
        return prisma.event.delete({
            where: {
                id: eventId
            }
        })
    }
}

export default Mutation