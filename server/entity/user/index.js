let User = class{
    userID  = ""
    roomID  = ""
    index = 0
    hitMos = []
    notifyFunc = (msg) => {
        console.log("notify user", this.userID, this.roomID, JSON.stringify(msg))
    }

    constructor(userID, notifyFunc) {
        this.userID = userID
        this.notifyFunc = notifyFunc || this.notifyFunc
    }
    
    setRoomInfo(room, index){
        this.roomID = room.roomID 
        this.index = index
    }

    addHitMos(hitMos) {
        this.hitMos = this.hitMos.concat(hitMos)
    }

    notify(msg){
        this.notifyFunc(msg)
    }
}

module.exports = User