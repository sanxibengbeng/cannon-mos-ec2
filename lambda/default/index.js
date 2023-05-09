const async = require('async')
const AWSXRay = require('aws-xray-sdk')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const process = require('process')
const shortUUID = require('short-uuid')

canhit = require("../logic/canhit").canHitTarget

const playerTableName = process.env.PLAYER_TABLE_NAME || "no_config_table"
const gameSessionTableName = process.env.GAME_SESSION_TABLE_NAME || "no_config_table"
const defaultRegion = process.env.DEFAULT_REGION || "no_config_region"
const ddb = initDynamoDB()
const enableLog = process.env['LOG_ENABLED'] || false
var wsMap = {}

//exports.handler = handleAction
exports.handler = function (event, context, callback) {
  console.log("default hanler ", event)
  wsMap = event.requestContext.wsMap
  handleAction(event)
}

function handleAction (event) {
  request = JSON.parse(event['body'])
  connectionId = event['requestContext']['connectionId']
  const domain = event.requestContext.domainName
  const stage = event.requestContext.stage
  if (!isNull(request) && !isNull(request['action'])) {
    switch (request['action']) {
      case 'create':
        console.log('create')
        createRoom(connectionId, request['room'])
        break
      case 'join':
        console.log('join')
        joinRoom(connectionId, request['room'], domain, stage)
        break
      case 'shoot':
        console.log('shoot')
        proceedShooting(request, connectionId, domain, stage)
        break
      default:
        console.log('default')
        break
    }
  } else {
    console.log(request)
    console.log(isNull(request))
    console.log(isNull(request.action))
  }
}




function stopGame (request) {
  async.waterfall(
    [
      function (callback) {
        readRecord(
          ddb,
          gameSessionTableName,
          {
            roomId: { S: request.roomId }
          },
          function (err, data) {
            if (err) {
              console.log(err)
              callback(err, null)
            } else {
              console.log(data)
              callback(null, data.Item)
            }
          }
        )
      },
      function (data, callback) {
        record = data
        record.running.S = 'false'
        updateRecord(ddb, gameSessionTableName, record, function (err, data) {
          if (err) {
            callback(err, null)
          } else {
            callback(null, record)
          }
        })
      },
      function (data, callback) {
        playerStatus = JSON.parse(data.status.S)
        data.winner = playerStatus['0'] >= playerStatus['1'] ? 0 : 1
        ids = JSON.parse(data.connectionIds.S)
        winner = { winner: data.winner }
        stopMsg = {
          type: 'game over',
          msg: JSON.stringify(winner)
        }
        notifyClients(ids, stopMsg, callback)
      }
    ],
    function (err, result) {
      console.log(err, result)
      if (!err) {
        console.log('create ok')
      }
    }
  )
}

function proceedShooting (request, connectionId, domain, stage) {
  shootInfo = request
  shootInfo.connectionId = connectionId
  shootInfo.domain = domain
  shootInfo.stage = stage
  handleShoot(shootInfo)
}

function createRoom (connectionId, roomName) {
  async.waterfall(
    [
      function (callback) {
        console.log(connectionId, process.env.PLAYER_TABLE_NAME)
        console.log('update player table', playerTableName)
        updateRecord(
          ddb,
          playerTableName,
          {
            connectionId: { S: connectionId },
            roomId: { S: roomName },
            host: { N: '0' }
          },
          function (err, data) {
            if (err) {
              console.log(err)
              callback(err, null)
            } else {
              console.log(data)
              callback(null, data)
            }
          }
        )
      },
      function (data, callback) {
        console.log('update session table', gameSessionTableName)
        updateRecord(
          ddb,
          gameSessionTableName,
          {
            roomId: { S: roomName },
            connectionIds: { S: JSON.stringify([connectionId]) }
          },
          function (err, data) {
            if (err) {
              console.log(err)
              callback(err, null)
            } else {
              console.log(data)
              callback(null, data)
            }
          }
        )
      }
    ],
    function (err, result) {
      console.log(err, result)
      if (!err) {
        console.log('create ok')
      }
    }
  )
}

function joinRoom (connectionId, roomName, domain, stage) {
  async.waterfall(
    [
      function (callback) {
        updateRecord(
          ddb,
          playerTableName,
          {
            connectionId: { S: connectionId },
            roomId: { S: roomName },
            host: { N: '1' }
          },
          function (err, data) {
            if (err) {
              callback(err, null)
            } else {
              callback(null, data)
            }
          }
        )
      },
      function (data, callback) {
        readRecord(
          ddb,
          gameSessionTableName,
          {
            roomId: { S: roomName }
          },
          function (err, data) {
            if (err) {
              callback(err, null)
            } else {
              callback(null, data.Item)
            }
          }
        )
      },
      function (data, callback) {
        if (null == data) {
          callback("nodata from session", null)
          return
        }
        var targets = randomTargets(2)
        participants = JSON.parse(data['connectionIds']['S'])
        participants.push(connectionId)
        updateRecord(
          ddb,
          gameSessionTableName,
          {
            roomId: { S: roomName },
            connectionIds: { S: JSON.stringify(participants) },
            targets: { S: JSON.stringify(targets) },
            status: {
              S: JSON.stringify({
                0: 0,
                1: 0
              })
            },
            running:{S: 'true'},
          },
          function (err, data) {
            if (err) {
              callback(err, null)
            } else {
              callback(null, data)
            }
          }
        )
      },
      function (data, callback) {
        readRecord(
          ddb,
          gameSessionTableName,
          {
            roomId: { S: roomName }
          },
          function (err, data) {
            if (err) {
              callback(err, null)
            } else {
              console.log('data', data.Item)
              callback(null, data.Item)
            }
          }
        )
      },
      function (data, callback) {
        console.log("data123", data)
        ids = JSON.parse(data.connectionIds.S)
        console.log("data123 ids", ids)
        intervalObj = setInterval(() =>{
          handleNewTargets({roomId: data.roomId.S})
        }, 5000)
        setTimeout(()=>{
          clearInterval(intervalObj);
          stopGame({roomId: data.roomId.S})
        }, 65000)
        startMsg = {
          type: 'game start',
          msg: JSON.stringify({ targets: JSON.parse(data.targets.S) })
        }
        notifyClients(ids, startMsg, callback)
      }
    ],
    function (err, result) {
      console.log("join callback", err, result)
      if (!err) {
        console.log('join ok')
      }
    }
  )
}

function handleNewTargets (body) {
  let request = {
    targets: randomTargets(2),
    roomId: body.roomId
  }
  updatedTargets = null
  //body.data.targets = { S: JSON.stringify() }
  async.waterfall(
    [
      function (callback) {
        console.log('read targets')
        readRecord(
          ddb,
          gameSessionTableName,
          {
            roomId: { S: request.roomId }
          },
          function (err, data) {
            if (err) {
              console.log(err)
              callback(err, null)
            } else {
              console.log(data)
              callback(null, data.Item)
            }
          }
        )
      },
      function (data, callback) {
        if (data.running.S == 'false') {
          callback(new Error('already stopped'), null)
        }
        console.log('update targets')
        updatedTargets = JSON.parse(data.targets.S).concat(
          request.targets
        )
        data.targets.S = JSON.stringify(updatedTargets)
        updateRecord(ddb, gameSessionTableName, data, function (err, data) {
          if (err) {
            console.log(err)
            callback(err, null)
          } else {
            console.log(data)
            callback(null, data)
          }
        })
        msg = {
          type: 'new target',
          msg: JSON.stringify({ targets: request.targets})
        }
        ids = JSON.parse(data.connectionIds.S)
        notifyClients(ids, msg, callback)
      },
    ],
    function (err, result) {
      console.log(err, result)
      if (!err) {
        console.log('create ok')
      }
    }
  )
}

function handleShoot (body) {
  shootItem = body
  async.waterfall(
    [
      function (callback) {
        console.log('get targets')
        readRecord(
          ddb,
          playerTableName,
          {
            connectionId: { S: shootItem.connectionId }
          },
          function (err, data) {
            if (err) {
              console.log(err)
              callback(err, null)
            } else {
              shootItem.player = data.Item.host.N
              callback(null, data.Item)
            }
          }
        )
      },
      function (data, callback) {
        console.log("shooting", data)
        readRecord(
          ddb,
          gameSessionTableName,
          {
            roomId: { S: data.roomId.S }
          },
          function (err, data) {
            if (err) {
              console.log(err)
              callback(err, null)
            } else {
              console.log(data)
              callback(null, data.Item)
            }
          }
        )
      },
      function (data, callback) {
        result = filterHit(JSON.parse(data.targets.S), shootItem)
        existingTargets = result.targets
        shootItem.hit = result.hit
        if (result.hit.length > 0) {
          playerStatus = JSON.parse(data.status.S)
          playerStatus[shootItem.player] += result.hit.length
          data.status.S = JSON.stringify(playerStatus)
        }
        data.targets.S = JSON.stringify(existingTargets)
        dataRecord = data
        updateRecord(ddb, gameSessionTableName, data, function (err, data) {
          if (err) {
            console.log(err)
            callback(err, null)
          } else {
            console.log(dataRecord)
            callback(null, dataRecord)
          }
        })
      },
      function (data, callback) {
        shootInfo = shootItem
        shootInfo.connectionIds = JSON.parse(data.connectionIds.S)
        shootInfo.stage = shootItem.stage
        shootInfo.domain = shootItem.domain
        shootInfo.hit = shootItem.hit
        console.log('shootInfo', shootInfo)
        updateShoot(shootInfo, function (err, data) {
          if (err) {
            console.log(err)
            callback(err, null)
          } else {
            console.log(data)
            callback(null, data.Item)
          }
        })
      }
    ],
    function (err, result) {
      console.log(err, result)
      if (!err) {
        console.log('create ok')
      }
    }
  )
}

function updateShoot (data, callback) {
  console.log('updateShoot data', data)

  ids = data.connectionIds
  shootMsg = {
    type: 'player shoot',
    msg: JSON.stringify({
      hit: data.hit,
      player: data.player,
      origin: {
        x: data.origin.x,
        y: data.origin.y
      },
      angle: data.angle
    })

  }
  notifyClients(ids, shootMsg, callback)
}

function filterHit (targets, shootInfo) {
  possibleHit = []
  ret = {
    targets: targets,
    hit: []
  }
  console.log("filter-hit ", shootInfo)
  for (let i = 0; i < targets.length; i++) {
    if (
      canhit(
        shootInfo.origin.x,
        shootInfo.origin.y,
        shootInfo.angle,
        targets[i].x,
        targets[i].y
      )
    ) {
      pointToRemove = targets[i]
      ret.hit.push(pointToRemove.id)
      ret.targets = targets.filter(obj => obj.id !== pointToRemove.id)
    }
  }
  return ret
}

function getRandomInt (size) {
  return Math.floor(Math.random() * (size * 2 + 1)) - size
}

function randomTargets (number) {
  ret = []
  for (let i = 0; i < number; i++) {
    x = getRandomInt(4)
    y = getRandomInt(3)
    ret.push({ x: x, y: y, id: shortUUID.generate() })
  }
  return ret
}

function notifyClient(item, callback) {
  console.log('notifyClient', item)
  var wsClient = wsMap[item.id] || null
  if (null == wsClient) {
    console.log("connection not exist ", item)
    return
  }
  wsClient.send(JSON.stringify(item.data))
}

function notifyClients (ids, data, callback) {
  console.log("update-target ", ids, data)
  notifyItem = (id, callback)=> {
    item = {
      'id' :id,
      'data':data,
    }
    notifyClient(item, callback)
  }
  async.each(ids, notifyItem, function (err) {
      console.log("notify callback ", err)
  })
}

function initDynamoDB () {
  console.log("default region in init ddb", defaultRegion)
  // Set the region
  AWS.config.update({ region: defaultRegion })

  // Create an SQS service object
  return new AWS.DynamoDB({ apiVersion: '2012-08-10' })
}

function updateRecord (ddb, tableName, content, callback) {
  var params = {
    TableName: tableName,
    Item: content
  }
  //console.log('in updateRecord', ddb, params)

  ddb.putItem(params, function (err, data) {
    callback(err, data)
  })
}

function isNull (value) {
  return value == null
}

function readRecord (ddb, tableName, keys, callback) {
  var params = {
    TableName: tableName,
    Key: keys
  }

  ddb.getItem(params, function (err, data) {
    callback(err, data)
  })
}