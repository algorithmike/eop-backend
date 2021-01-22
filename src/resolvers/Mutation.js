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
    editUser,
    editContent,
    deleteEvent: (parent, args, {tokenData}) => {
        // If the event has content associated with it, disassociate organizer from event.
        // Else delete event.
    }
}

export default Mutation