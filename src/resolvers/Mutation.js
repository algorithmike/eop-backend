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
    deleteUser: (_, __, {tokenData}) => {
        // Delete current user, their content, and disassociate or delete their events
        // based on conditions of other people's content connected with it.
        if(!tokenData){
            throw new Error('Unauthorized action!')
        }

        return prisma.user.findUnique({
            where: {id: tokenData.id}
        })
    },
    deleteContent
}

export default Mutation