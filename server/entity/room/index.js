const Mosquito = require("../mosquito/")
const canHitTarget = require("../../logic/canhit.js")

let Room = class {
    STAT_WAITING = 1
    STAT_FIGNTING = 2
    STAT_CLOSED = 3

    roomID = ""
    users = []
    mosquito = []
    state = this.STAT_WAITING
    mosquitoGroup = {}
    shootCounter = [0, 0]
    winner = 0

    constructor(roomID, user) {
        this.roomID = roomID
        this.users.push(user)
        this.mosquitoGroup = new Mosquito()
        console.log("roomID", this.roomID, "created", new Date())
    }

    userJoined(user) {
        this.setStat(this.STAT_FIGNTING)
        this.users.push(user)
        var newMosquito = this.mosquitoGroup.generate(2)
        this.mosquito = this.mosquito.concat(newMosquito)

        console.log("roomID", this.roomID, "user joined", new Date())
        var msg = {
          type: 'game start',
          msg: JSON.stringify({ targets: newMosquito})
        }
        this.notifyUsers(msg)
    }

    addMosquito(number) {
        var newMosquito = this.mosquitoGroup.generate(number)
        this.mosquito = this.mosquito.concat(newMosquito)
        var msg = {
          type: 'new target',
          msg: JSON.stringify({ targets: newMosquito})
        }
        this.notifyUsers(msg)
        return newMosquito
    }

    notifyUsers(msg) {
        this.users.forEach((user) => {
            user.notify(msg)
        })
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

    shoot(user, shootInfo) {
        var ret = {
            hit: [],
            targets: this.mosquito,
        }
        //console.log("shoot", shootInfo)
        var targets = this.mosquito
        for (let i = 0; i < targets.length; i++) {
            if (
                canHitTarget(
                    shootInfo.origin.x,
                    shootInfo.origin.y,
                    shootInfo.angle,
                    targets[i].x,
                    targets[i].y
                )
            ) {
                var pointToRemove = targets[i]
                ret.hit.push(pointToRemove.id)
                ret.targets = ret.targets.filter(obj => obj.id !== pointToRemove.id)
            }
        }
        this.mosquito = ret.targets
        user.addHitMos(ret.hit)
        this.shootCounter[user.index] += ret.hit.length
        // update winner info
        this.winner = 0
        if (this.shootCounter[1] > this.shootCounter[0]) {
            this.winner = 1
        }
        var msg = {
            type: 'player shoot',
            msg: JSON.stringify({
                hit: ret.hit,
                player: user.index,
                origin: {
                    x: shootInfo.origin.x,
                    y: shootInfo.origin.y
                },
                angle: shootInfo.angle
            })
        }
        this.notifyUsers(msg)
    }
    stop() {
        this.stat = this.STAT_CLOSED
        console.log("roomID", this.roomID, "stopped", new Date())
        var msg = {
          type: 'game over',
          msg: JSON.stringify({winner:this.winner})
        }
        this.notifyUsers(msg)
    }
}

module.exports = Room;