import path from 'path'
import { createWriteStream } from 'fs'

const uploadFile = async (_, {file}) => {
    const {createReadStream, filename, mimetype, encoding} = await file
    const pathName = path.join(__dirname, '../../../public/content', filename)

    await new Promise(res => 
        createReadStream()
            .pipe(createWriteStream(pathName))
            .on('close', res)
    )
    return {
        url: pathName
    }
}

export default uploadFile