const Mosquito = require("../mosquito/")

let Room = class {
    STAT_WAITING = 1
    STAT_FIGNTING = 2
    STAT_CLOSED = 3

    roomID = ""
    users = []
    mosquito = []
    state = this.STAT_WAITING
    mosquitoGroup = {}

    constructor(roomID, user) {
        this.roomID = roomID
        this.users.push(user)

        this.mosquitoGroup = new Mosquito()
    }

    addUser(user) {
        this.users.push(user)
    }

    addMosquito(number) {
        var newMosquito = this.mosquitoGroup.generate(number)
        this.mosquito = this.mosquito.concat(newMosquito)
    }

    setStat(state) {
        this.state = state
    }

    canCreate() {
        return this.state == this.STAT_CLOSED
    }

    canJoin() {
        return this.state == this.STAT_WAITING
    }

}

module.exports = Room;