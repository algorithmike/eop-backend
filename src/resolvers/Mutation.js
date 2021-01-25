import claimEvent from './Mutations/claimEvent'
import createContent from './Mutations/createContent'
import createEvent from './Mutations/createEvent'
import createUser from './Mutations/createUser'
import deleteContent from './Mutations/deleteContent'
import deleteEvent from './Mutations/deleteEvent'
import deleteUser from './Mutations/deleteUser'
import editContent from './Mutations/editContent'
import editEvent from './Mutations/editEvent'
import editUser from './Mutations/editUser'
import login from './Mutations/login'

const Mutation = {
    claimEvent,
    createContent,
    createEvent,
    createUser,
    deleteContent,
    deleteEvent,
    deleteUser,
    editContent,
    editEvent,
    editUser,
    login
}

export default Mutation