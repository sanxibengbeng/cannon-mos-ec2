let User = class{
    userID  = ""
    index = 0
    hitMos = []
    room = {}

    constructor(userID) {
        this.userID = userID
    }
    
    setRoomInfo(room, index){
        this.room = room
        this.index = index
    }
}
module.exports = User