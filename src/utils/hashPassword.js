import bcrypt from 'bcryptjs'

const hashPassword = (password) => {
    if(password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)){
        return bcrypt.hash(password, 10)
    } else{
        throw new Error('Password must contain between 8 and 20 characters including\n'
        + ' at least one number, an upper case letter, and a lower case letter.')
    }
}

export default hashPassword