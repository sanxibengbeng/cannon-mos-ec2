const express = require('express');
const expressWs = require('express-ws')
const router = express.Router()
expressWs(router);
var connectHandler = require('../lambda/default/index')
router.ws('/', (ws, req) => {
  ws.onopen = (event) => {
    console.log(event)
  }
  handle = (event) => {
    var req = {
      'body': event['data'],
      'requestContext':{
        'connectionId':'abc',
        'domain':'host',
        'stage':'stage',
      },
    }
    res = connectHandler.handler(req)
    console.log(res)
    //ws.send(res.body)
  }
  ws.onmessage = handle
//  ws.onmessage = (event) => {
//    console.log(event)
//    var res = connectHandler(event)
//    console.log(res)
//  }

  //ws.send('连接成功')
  //let interval
  //interval = setInterval(() => {
  //  if (ws.readyState === ws.OPEN) {
  //    ws.send(Math.random().toFixed(2))
  //  } else {
  //    clearInterval(interval)
  //  }
  //}, 1000)
})

module.exports = router
