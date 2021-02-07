import path from 'path'

const uploadFile = async (_, {file}, {space}) => {
    const {createReadStream, filename, mimetype} = await file

    // Create logic for file type here: If image, elsse if video, else reject.
    // Also, put this into a util, and use it in "createContent.js" instead of
    // as a separate mutation.
    console.log('mimetype: ', mimetype)

    space.upload({
        Body: createReadStream(filename),
        Bucket: process.env.SPACES_PHOTO_BUCKET,
        Key: path.basename(filename),
        ACL: 'public-read'
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