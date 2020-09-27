import express from 'express'
import * as socketio from 'socket.io'
import cors from 'cors'
import { RealTimeMonitor } from './realTimeStats'
import { ProductionMonitor } from './productionStats'
import { ReportProxy } from './reportProxy'

const reportProxy = new ReportProxy(10000)
console.log(reportProxy)
console.log('Entered')
const app = express()
app.set('origins', 'http://localhost:8080')

app.use(cors())

app.get('/report', (req, res) => {
    const quality: string | undefined = req.query.quality?.toString()
    let ini: string | undefined = undefined
    if (typeof req.query.ini === 'string') {
      ini = req.query.ini
    }
    let end: string | undefined = undefined
    if (typeof req.query.end === 'string') {
      end = req.query.end
    }
    const page: string | undefined = req.query.page?.toString()
    const rows: string | undefined = req.query.rows?.toString()

    const iniDate: Date | undefined = ini? new Date(ini) : undefined
    const endDate: Date | undefined = end? new Date(end) : undefined
    const pageInt: number | undefined = page? parseInt(page) : 0
    const rowsInt: number | undefined = rows? parseInt(rows) : 10

    const result = reportProxy.find(
      quality,
      iniDate,
      endDate,
      pageInt,
      rowsInt
    )

    res.send(result)
})

const server = app.listen(3000, () => {
    console.log('listening port 3000')
})

const io = socketio.listen(server)
const realTimeMonitor = new RealTimeMonitor(50, 100)
const productionMonitor = new ProductionMonitor()
realTimeMonitor.initRealtimeGeneration()
productionMonitor.initProductionGeneration()


io.on("connection", (socket: any) => {
  console.log("a user connected");

  socket.on('disconnect', () => {
    console.log('Disconnected')
  })
  socket.emit("metrics", realTimeMonitor.metrics)
  socket.emit("production", productionMonitor.production)
  realTimeMonitor.eventHandler = () => {
    socket.emit("metrics", realTimeMonitor.metrics)
  }

  productionMonitor.eventHandler = () => {
    socket.emit("production", productionMonitor.production)
  }

});


