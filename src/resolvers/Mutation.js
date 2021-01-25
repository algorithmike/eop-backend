import claimEvent from './Mutations/claimEvent'
import createContent from './Mutations/createContent'
import createEvent from './Mutations/createEvent'
import createUser from './Mutations/createUser'
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
    deleteUser: () => {
        // Delete current user, their content, and disassociate or delete their events
        // based on conditions of other people's content connected with it.
    },
    deleteContent: async (_, {contentId}, {tokenData}) => {
        // Verify content is authorized by user.
        // Delete content.
        // If the associated event has no organizer or other content, delete that event.
        if(!tokenData){
            throw new Error('Unauthorized action!')
        }

        const content = await prisma.content.findFirst({
            where: {
                AND: [
                    {id: contentId},
                    {authorId: tokenData.id}
                ]
            },
            include: {
                event: {
                    select: {content: true}
                }
            }
        }).then(result => {
            if(!result){
                throw new Error('Unable to identify content.')
            }
            return result
        })

        if(content.event.content.length > 1){
            // Delete the content, but don't delete the event
            return prisma.content.delete({
                where: { id: contentId }
            })
        }

        // Delete the content AND the content-less event
        const deletedContent = prisma.content.delete({
            where: {id: contentId}
        })

        const deletedEvent = prisma.event.delete({
            where: {
                id: content.eventId
            }
        })
        return prisma.$transaction([deletedContent, deletedEvent])
    }
}

export default Mutation