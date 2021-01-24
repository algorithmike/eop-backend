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

    return {
        token: jwt.sign({id: user.id}, process.env.JWT_SECRET, {algorithm: 'HS256'})
    }
}

export default login