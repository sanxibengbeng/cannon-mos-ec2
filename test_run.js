const RoomStorage = require("./server/model/local/roomStorage");
const UserStorage = require("./server/model/local/userStorage");
const World = require("./server/entity/world")
const User = require("./server/entity/user")

test = () => {
    us = new UserStorage()
    rs = new RoomStorage()
    world = new World(rs, us)
    world.create("r1", new User("u1"))
    console.log("after create", JSON.stringify(us), JSON.stringify(rs))
    world.join("r1", new User("u2"))
    console.log("after join", JSON.stringify(us), JSON.stringify(rs))

    shootParam= {
        "action":"shoot",
        "origin":{
            "x":5,
            "y":-4
        },
        "angle":116.07306671142578
    }

    intervalObj = setInterval(() =>{
        world.shoot("u2", shootParam)
        console.log("after shoot", JSON.stringify(us), JSON.stringify(rs))
    }, 10000)

    setTimeout(function () {
        clearInterval(intervalObj);
    }, 40000)
}
test()