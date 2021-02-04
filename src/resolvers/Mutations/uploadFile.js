const uploadFile = async (_, {file}, {bucket}) => {
    const {createReadStream, filename, mimetype} = await file

    console.log('mimetype: ', mimetype)

    await new Promise(res => 
        createReadStream()
            .pipe(
                bucket.file(filename).createWriteStream({
                    resumable: false,
                    gzip: true
                })
            )
            .on('finish', res)
    )
    return {
        url: `${process.env.BUCKET_URL}${filename}`
    }
}

export default uploadFile