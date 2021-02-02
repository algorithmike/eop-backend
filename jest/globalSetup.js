import 'regenerator-runtime/runtime.js'
import app from '../src/app'

export default async () => {
    global.httpServer = await app.listen({ port: process.env.PORT || 4000 })
}