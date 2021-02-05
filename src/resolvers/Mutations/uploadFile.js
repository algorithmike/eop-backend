import path from 'path'

const uploadFile = async (_, {file}, {space}) => {
    const {createReadStream, filename, mimetype} = await file

    console.log('mimetype: ', mimetype)

    space.upload({
        Body: createReadStream(filename),
        Bucket: process.env.PHOTO_BUCKET, // Update Env Var
        Key: path.basename(filename),
        ACL: 'public-read-write'
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