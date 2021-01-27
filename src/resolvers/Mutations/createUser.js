import jwt from 'jsonwebtoken'
import hashPassword from '../../utils/hashPassword'

const createUser = async (_, {data}, {prisma} ) => {
    const existingUsers = await prisma.user.count({
        where: {
            OR: [
                { email: data.email },
                { username: data.username }
            ]
        }
    })

    if(existingUsers > 0){
        throw new Error('That email or username is already in use.')
    }

    const user = await prisma.user.create({
        data: {
            ...data,
            password: await hashPassword(data.password)
        }
    })

    return {
        token: jwt.sign({id: user.id}, process.env.JWT_SECRET, {algorithm: 'HS256'})
    }
}

export default createUser