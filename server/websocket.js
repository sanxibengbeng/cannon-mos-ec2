const RoomStorage = require("./model/local/roomStorage");
const UserStorage = require("./model/local/userStorage");
const World = require("./entity/world")
const User = require("./entity/user")

const express = require('express');
const expressWs = require('express-ws')
const router = express.Router()
const short = require("short-uuid");

var us = new UserStorage()
var rs = new RoomStorage()
var world = new World(rs, us)

expressWs(router);


router.ws('/', (ws, req) => {
  getNotifyFunc = ()=>{
    return (msg)=>{
      ws.send(JSON.stringify(msg))
    }
  }
  const uuid = short.generate()
  var user = new User(uuid, getNotifyFunc())

  var msgHandler= (event) => {
    request = JSON.parse(event['data'])
    switch (request['action']) {
      case 'create':
        world.create(request["room"], user)
        break
      case 'join':
        world.join(request["room"], user)
        break
      case 'shoot':
        world.shoot(user.userID, request)
        break
      default:
        console.log('default')
        break
    }
  }

  ws.onmessage = msgHandler

  var closeHandle = (event) => {
    console.log("connection closed", user, event)
  }
  ws.onclose =  closeHandle
})

module.exports = router
