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

    if(password){
        if(password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)){
            updates.password = await bcrypt.hash(password, 10)
        } else{
            throw new Error('Password must contain between 8 and 20 characters including\n'
            + ' at least one number, an upper case letter, and a lower case letter.')
        }
    }

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