import login from './Mutations/login'
import createUser from './Mutations/createUser'
import createContent from './Mutations/createContent'
import createEvent from './Mutations/createEvent'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const Mutation = {
    login,
    createUser,
    createContent,
    createEvent,
    editUser
}

export default Mutation