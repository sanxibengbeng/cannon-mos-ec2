const Room = require("../room/")

let World = class {

    roomStorage = {}
    userStorage = {}

    constructor(roomStorage, userStorage) {
        this.roomStorage = roomStorage
        this.userStorage = userStorage
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

        // todo add generate task to queue

        // todo   move storage logic 
        this.roomStorage.save(room)
        this.userStorage.save(user)

        // todo notify users
    }

    newMosquito(roomID) {
        var room = this.roomStorage.get(roomID)
        if ((room instanceof Room)) {
            return new Error("roomStatsError")
        }
        room.addMosquito(2)
        this.roomStorage.save(room)
    }

    shoot() {
    }

    stop(roomID) {
    }
}

module.exports = World;