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
    editContent: async (_, {edits}, {tokenData}) => {
        if(!tokenData){
            throw new Error('Anauthorized action!')
        }

        const {id, title, description, customDate, eventId} = edits
        const originalContent = await prisma.content.findUnique({
            where: {id}
        })

        if(originalContent.authorId !== tokenData.id){
            throw new Error('Anauthorized action!')
        }

        // Continue here: Add Update


        return originalContent

    }
}

export default Mutation