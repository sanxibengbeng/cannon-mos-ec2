let RoomStorage = class {
    dict = {}
    save(room) {
        this.dict[room.roomID] = room
    }
    delete(roomID) {
        return delete(this.dict[roomID])
    }
    get(roomID) {
        return this.dict[roomID] || null
    }
}

module.exports = RoomStorage;