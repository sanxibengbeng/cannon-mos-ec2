let RoomStorage = class {
    dict = {}
    save(room) {
        this.dict[room.roomID] = room
    }
    get(roomID) {
        return this.dict[roomID] || null
    }
}

module.exports = RoomStorage;