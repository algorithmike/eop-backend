const uploadFile = async (_, {file}) => {
    const {createReadStream, filename, mimetype} = await file

    console.log('mimetype: ', mimetype)

    return {
        url: `*enter*url*here/${filename}`
    }
}

export default uploadFile