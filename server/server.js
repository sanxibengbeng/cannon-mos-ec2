const express = require('express')
const app = express()
const expressWs = require('express-ws')
const websocket = require('./websocket')

expressWs(app);

app.use(express.static('public'))
app.use('/wss', websocket)
app.get('/hi', (req, res) => {
  res.send("hello")
})
app.listen(3000, () => {
  console.log('server is listening on port 3000')
})

