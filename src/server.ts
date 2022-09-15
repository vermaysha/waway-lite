import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import routes from './routes'
import Wa from './libs/Wa'

const serve = async () => {
  // Connecting to Whatsapp client
  Wa.connect()

  const app = express()
  const port = process.env.PORT || 3000

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }))

  // parse application/json
  app.use(bodyParser.json())

  // setup CORS
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'HEAD'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      credentials: true,
    })
  )

  // Load all router
  routes(app)

  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
  })
}

serve()
