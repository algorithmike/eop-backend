import login from './Mutations/login'
import createUser from './Mutations/createUser'
import createContent from './Mutations/createContent'
import createEvent from './Mutations/createEvent'

const Mutation = {
    login,
    createUser,
    createContent,
    createEvent,
    editUser: async (parent, args, context, info) => {

        
    }
}

export default Mutation