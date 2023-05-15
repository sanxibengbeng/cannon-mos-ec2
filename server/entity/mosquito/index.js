let Mosquito = class {
    index = 0
    generate(number) {
        var ret = []
        for (let i = 0; i < number; i++) {
            var x = this.getRandomInt(4)
            var y = this.getRandomInt(3)
            var id = this.index++
            ret.push({ x: x, y: y, id: id })
        }
        return ret
    }
    getRandomInt(size) {
        return Math.floor(Math.random() * (size * 2 + 1)) - size
    }
}

module.exports = Mosquito