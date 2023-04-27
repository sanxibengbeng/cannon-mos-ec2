const express = require('express');
const expressWs = require('express-ws')
const router = express.Router()
const short = require("short-uuid");

expressWs(router);

var connectHandler = require('../lambda/default/index')
var disConnectHandler = require('../lambda/disconnect/index')
var wsMap = {}

router.ws('/', (ws, req) => {
  var callbackFunc = (err, res) => {
    console.log("callback", err, res)
    ws.send(res.body)
  }
  const uuid = short.generate()
  wsMap[uuid] = ws
  var req = {
    'requestContext': {
      'connectionId': uuid,
      'domain': 'host',
      'stage': 'stage',
      'wsMap': wsMap,
    },
  }
  console.log('wss uuid', uuid)
  var msgHandle = (event) => {
    req.body = event['data']
    console.log("handling", req)
    connectHandler.handler(req, {}, callbackFunc)
  }
  ws.onmessage = msgHandle

  var closeHandle = (event) => {
    req.body = event['data'] || '{}'
    console.log("closing", req)
    disConnectHandler.handler(req, {}, (err, msg)=>{
      console.log("closing callback", err, msg)
    })
  }
  ws.onclose =  closeHandle

  // todo 定时指行closeHandle 清理数据

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
