import express from 'express'
import { APP_PORT, DB_URL } from './config'
import routes from './routes'
import mongoose from 'mongoose'
import errorHandler from './middleware/errorHandler'
import bodyParser from 'body-parser'
import cors from 'cors'
import ws from 'ws'
const app = express()
mongoose.connect(DB_URL) 
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Database Connection Error'))
db.once('open', () => {
  console.log('Database Connected')
})
// Middlewares
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json())
app.use(routes)

app.use(errorHandler)
 const server = app.listen(APP_PORT, () => {
  console.log(`Server Running on ${APP_PORT}`)
})

const wss = new ws.WebSocketServer({server})
wss.on('connection', (connection, req)=>{

  connection.isAlive = true;
  connection.on('message', (message)=>{
    console.log(message);
  })
  
})








