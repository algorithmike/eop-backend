import path from 'path'

const uploadFile = async (_, {file}, {s3}) => {
    const {createReadStream, filename, mimetype} = await file

    console.log('mimetype: ', mimetype)

    s3.upload({
        Body: createReadStream(filename),
        Bucket: process.env.AWS_PHOTO_CONTENT_BUCKET,
        Key: path.basename(filename)
    }, (err, data) => {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data.Location);
            return {
                url: data.Location
            }
        }
    })
    return {
        url: `*enter*url*here/${filename}`
    }
}

export default uploadFile