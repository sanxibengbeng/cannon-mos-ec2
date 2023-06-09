const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, `./environments/${ process.env.NODE_ENV }.env`) });

const express = require('express')
const app = express()
const expressWs = require('express-ws')
const websocket = require('./websocket')


expressWs(app);

app.use(express.static('public'))
app.use('/wss', websocket)

port = process.env.PORT|| 3000
app.listen(port, () => {
  console.log('server is listening on port ' + port)
  console.log('http://127.0.0.1:' + port + '?serverUrl=ws://127.0.0.1:' + port + '/wss')
})

