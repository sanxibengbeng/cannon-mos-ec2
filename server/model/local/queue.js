myConst = require("../../const.js")
var Queue = require('fastq');
const Room = require("../../entity/room/")


let CMDQueue = class {
    roomStorage = {}
    que = {}
    constructor(roomStorage) {
        this.roomStorage = roomStorage
        this.que = new Queue(this.taskHandler(), 1)
    }

    push(msg) {
        this.que.push(msg)
    }

    // taskHandler  tasks in queue
    taskHandler() {
        return (info, cb) => {
            switch (info['action']) {
                case myConst.ACTION_SHOOT:
                    this.handleShoot(info)
                    break
                case myConst.ACTION_NEW_MOSQUITO:
                    this.handleNewMosquito(info)
                    break
                default:
                    console.log("queue no handler for ", info)
            }
            cb(null, {})
        }
    }
    handleNewMosquito(info) {
        console.log("handle new mosquito", info)
        var roomID = info.roomID
        var room = this.roomStorage.get(roomID)
        if (!(room instanceof Room)) {
            return new Error("roomStatsError")
        }
        room.addMosquito(2)
        // todo  notify users
        this.roomStorage.save(room)
    }

    handleShoot(info) {
        console.log("handle shoot", info)
        //todo shoot
    }

}

module.exports = CMDQueue;