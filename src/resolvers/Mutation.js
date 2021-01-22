import login from './Mutations/login'
import createUser from './Mutations/createUser'
import createContent from './Mutations/createContent'
import createEvent from './Mutations/createEvent'
import editUser from './Mutations/editUser'

import { PrismaClient } from '@prisma/client' // To be deleted from this module after refactoring
const prisma = new PrismaClient() // To be deleted from this module after refactoring

const Mutation = {
    login,
    createUser,
    createContent,
    createEvent,
    editUser,
    editContent: async (_, {edits}, {tokenData, prisma}) => {
        if(!tokenData){
            throw new Error('Invalid token!')
        }

        const {id, title, description, customDate, eventId} = edits
        const updates = {}
        const originalContent = await prisma.content.findUnique({
            where: {id}
        }).catch(() => {
            throw new Error('Unable to identify content.')
        })

        if(originalContent.authorId !== tokenData.id){
            throw new Error('Anauthorized action!')
        }
        if(title && title.length > 0){ updates.title = title }
        if(description){ updates.description = description }
        if(customDate && typeof customDate === 'number'){ updates.customDate = customDate }
        if(eventId){
            await prisma.event.findUnique({
                where: {id: eventId}
            }).catch(() => {
                throw new Error('Unable to update event.')
            })
        }

        return prisma.content.update({
            where: {id},
            data: {
                ...updates,
                event: {
                    connect: (eventId) ? {id: eventId} : false
                }
            }
        })
    }
}

export default Mutation