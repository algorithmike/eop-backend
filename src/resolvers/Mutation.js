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

import path from 'path'
import { createWriteStream } from 'fs'

const files = [];

const uploadFile = async (parent, {file}, context) => {
    console.log('uploadFile CHECKPOINT!')
    const {createReadStream, filename, mimetype, encoding} = await file
    const pathName = path.join(__dirname, '../../public/images', filename)

    await new Promise(res => 
        createReadStream()
            .pipe(createWriteStream(pathName))
            .on('close', res)
    )

    files.push(filename)
    return {
        url: pathName
    }
}

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
    login,
    uploadFile // FOR FILE UPLOAD
}

export default Mutation