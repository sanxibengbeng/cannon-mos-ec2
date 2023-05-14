let userStorage = class {
    dict = {}
    save(user) {
        this.dict[user.userID] = user
    }
    get(userID) {
        return this.dict[userID] || null
    }
}

let roomStorage = class {
    dict = {}
    save(room) {
        this.dict[room.roomID] = room
    }
    get(roomID) {
        return this.dict[roomID] || null
    }
}
World = require("../../../server/entity/world")
User = require("../../../server/entity/user")
test('create room', () => {
    us = new userStorage()
    rs = new roomStorage()
    world = new World(rs, us)
    world.create("r1", new User("u1"))
    console.log("after create", us, rs)
    world.join("r1", new User("u2"))
    console.log("after join", us, rs)
});
