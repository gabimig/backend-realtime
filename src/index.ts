import express from 'express'
import * as socketio from 'socket.io'
import cors from 'cors'
import { RealTimeMonitor } from './realTimeStats'

const app = express()
app.set('origins', 'http://localhost:8080')

app.use(cors())

app.get('/', (req, res) => {
    res.send("hello internet.")
})

const server = app.listen(3000, () => {
    console.log('listening port 3000')
})

const io = socketio.listen(server)
const realTimeMonitor = new RealTimeMonitor(50, 100)
realTimeMonitor.initRealtimeGeneration()

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", (socket: any) => {
  console.log("a user connected");

  socket.on('disconnect', () => {
    console.log('Disconnected')
  }) 

  realTimeMonitor.eventHandler = () => {
    socket.emit("metrics", realTimeMonitor.metrics)
  }

});


