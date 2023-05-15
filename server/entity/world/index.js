myConst = require("../../const.js")
const Room = require("../room/")
const CMDQueue = require("../../model/local/queue.js")
const process = require('process')

const genInterval = process.env.GEN_MOS_INTERVAL || 2000
const gameTime = process.env.GAME_TIME || 60000




let World = class {

    roomStorage = {}
    userStorage = {}
    queue = {}

    constructor(roomStorage, userStorage) {
        this.roomStorage = roomStorage
        this.userStorage = userStorage
        this.queue = new CMDQueue(roomStorage)
    }

    // create createRoom
    create(roomID, user) {
        var room = this.roomStorage.get(roomID)
        if ((room instanceof Room) && !room.CanCreate()) {
            return new Error("roomReplicate")
        }

        room = new Room(roomID, user)
        user.setRoomInfo(room, 0)

        this.roomStorage.save(room)
        this.userStorage.save(user)
    }

    // join  user joinRoom
    join(roomID, user) {
        var room = this.roomStorage.get(roomID)
        if ((room instanceof Room) && !room.canJoin()) {
            return new Error("roomStatsError")
        }
        room.setStat(room.STAT_FIGNTING)
        room.addMosquito(2)
        user.setRoomInfo(room, 1)

        // generate mosquito automatically
        var intervalObj = setInterval(() => {
            var newTargetInfo = {
                action: myConst.ACTION_NEW_MOSQUITO,
                roomID: roomID
            }
            console.log("push task", newTargetInfo)
            this.queue.push(newTargetInfo)
        }, genInterval)

        setTimeout(() => {
            clearInterval(intervalObj);
            this.stop(roomID)
        }, gameTime)

        // todo   move storage logic 
        this.roomStorage.save(room)
        this.userStorage.save(user)

        // todo notify users
    }

    shoot() {
    }

    stop(roomID) {
    }


}

module.exports = World;