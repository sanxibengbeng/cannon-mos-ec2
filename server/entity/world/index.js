const Room = require("../room/")
const Mosquito = require("../mosquito/")

let World = class {

    roomStorage = {}
    userStorage = {}
    mosquitoGroup = {}

    constructor(roomStorage, userStorage) {
        this.roomStorage = roomStorage
        this.userStorage = userStorage
        this.mosquitoGroup = new Mosquito()
    }

    // createRoom createRoom and init
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

    join(roomID, user) {
        var room = this.roomStorage.get(roomID)
        if ((room instanceof Room) && !room.canJoin()) {
            return new Error("roomStatsError")
        }
        room.setStat(room.STAT_FIGNTING)
        room.addMosquito(this.mosquitoGroup.generate(2))

        user.setRoomInfo(room, 1)

        this.roomStorage.save(room)
        this.userStorage.save(user)
    }

    shoot() {

    }
}

module.exports = World;