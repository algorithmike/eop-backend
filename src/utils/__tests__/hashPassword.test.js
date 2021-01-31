import "regenerator-runtime/runtime.js"
import hashPassword from '../hashPassword'
import bcrypt from 'bcryptjs'


describe('Password', () => {
    test('does not meet requirements, throws error.', () => {
        const testHashPasswordError = () => hashPassword('password')
    
        expect(testHashPasswordError).toThrowError(/Password/)
    })

    test('meets requirements.', async () => {
        const password = 'lowerAndUpperCase123'
        const hashedPassword = await hashPassword(password)
        
        expect(await bcrypt.compare(password, hashedPassword)).toBe(true)
    })
})