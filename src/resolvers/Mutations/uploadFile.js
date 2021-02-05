

const uploadFile = async (_, {file}) => {
    const {createReadStream, filename, mimetype} = await file

    console.log('mimetype: ', mimetype)

    await new Promise(res => 
        createReadStream()
            .pipe(
                // ****** REPLACE THIS GOOGLE BUCKET CODE ******
                // bucket.file(filename).createWriteStream({
                //     resumable: false,
                //     gzip: true
                // })
            )
            .on('finish', res)
    )
    return {
        url: `*enter*url*here/${filename}`
    }
}

export default uploadFile