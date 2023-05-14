let Room = class {
    STAT_WAITING = 1
    STAT_FIGNTING = 2
    STAT_CLOSED = 3

    roomID = ""
    users = []
    mosquito = []
    state = this.STAT_WAITING

    constructor(roomID, user) {
        this.roomID = roomID
        this.users.push(user)
    }

    addUser(user) {
        this.users.push(user)
    }

    addMosquito(mosquito) {
        this.mosquito = this.mosquito.concat(mosquito)
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