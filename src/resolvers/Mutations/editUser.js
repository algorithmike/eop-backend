import hashPassword from '../../utils/hashPassword'

const editUser = async (_, {edits}, {tokenData, prisma}, info) => {
    if(!tokenData){
        throw new Error('Unauthorized action!')
    }
    const {
        email, username, password, realname, description, profilePicUrl
    } = edits
    const user = await prisma.user.findUnique({
        where: {
            id: tokenData.id
        }
    })
    if(!user){
        throw new Error('User not found.')
    }

    const updates = {}

    updates.password = await hashPassword(password)

    if(email){ updates.email = email }
    if(username){ updates.username = username }
    if(realname){ updates.realname = realname }
    if(description){ updates.description = description }
    if(profilePicUrl){ updates.profilePicUrl = profilePicUrl }

    return prisma.user.update({
        where: {id: tokenData.id},
        data: {...updates}
    })
}

export default editUser