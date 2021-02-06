import 'regenerator-runtime/runtime.js'
import app from './app'


app.listen({ port: process.env.PORT || 4000 }, () => {
    if(!process.env.PORT){
      console.log(`🚀 Server ready at http://localhost:4000/`)
    }
  }
)