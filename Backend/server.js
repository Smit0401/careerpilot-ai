require('dotenv').config()

const app = require('./src/app')
const connectDB = require('./src/config/database')
const { connectRedis } = require('./src/services/redis.service')

const port = process.env.PORT || 3000

async function startServer() {

  await connectDB()
  await connectRedis()

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })

}

startServer().catch((error) => {
  console.error('Unable to start server:', error.message)
  process.exit(1)
})