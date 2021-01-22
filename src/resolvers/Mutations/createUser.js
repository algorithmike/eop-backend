import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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

    if(!data.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)){
        throw new Error('Password must contain between 8 and 20 characters including\n'
            + ' at least one number, an upper case letter, and a lower case letter.'
        )
    }

    const user = await prisma.user.create({
        data: {
            ...data,
            password: await bcrypt.hash(data.password, 10)
        }
    })

    return {
        token: jwt.sign({id: user.id}, 'JWT_SECRET_PLACEHOLDER', {algorithm: 'HS256'})
    }
}

export default createUser