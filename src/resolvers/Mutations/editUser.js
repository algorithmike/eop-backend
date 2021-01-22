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

    const updatedUser = {}

    if(password){
        if(password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)){
            updatedUser.password = await bcrypt.hash(password, 10)
        } else{
            throw new Error('Password must contain between 8 and 20 characters including\n'
            + ' at least one number, an upper case letter, and a lower case letter.')
        }
    }

    if(email && email.length > 0){
        updatedUser.email = email
    }
    if(username && username.length > 0){
        updatedUser.username = username
    }
    if(realname && realname.length > 0){
        updatedUser.realname = realname
    }
    if(description && description.length > 0){
        updatedUser.description = description
    }
    if(profilePicUrl){
        updatedUser.profilePicUrl = profilePicUrl
    }

    return prisma.user.update({
        where: {id: tokenData.id},
        data: {...updatedUser}
    })
}

export default editUser