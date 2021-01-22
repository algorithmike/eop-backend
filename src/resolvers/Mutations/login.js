import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const login = async (_, {email, password}, {prisma}) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if(!user || !(await bcrypt.compare(password, user.password))){
        throw new Error("Unable to log in.")
    }

    delete user.password

    return {
        token: jwt.sign({user}, 'JWT_SECRET_PLACEHOLDER', {algorithm: 'HS256'})
    }
}

export default login