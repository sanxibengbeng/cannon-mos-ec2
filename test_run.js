const RoomStorage = require("./server/model/local/roomStorage");
const UserStorage = require("./server/model/local/userStorage");
const World = require("./server/entity/world")
const User = require("./server/entity/user")

test = () => {
    us = new UserStorage()
    rs = new RoomStorage()
    world = new World(rs, us)
    world.create("r1", new User("u1"))
    console.log("after create", us, rs)
    world.join("r1", new User("u2"))
    console.log("after join", us, rs)

    setTimeout(function () {
    }, 10)
}
test()