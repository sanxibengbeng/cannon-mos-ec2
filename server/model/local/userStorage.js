let UserStorage = class {
    dict = {}
    save(user) {
        this.dict[user.userID] = user
    }
    get(userID) {
        return this.dict[userID] || null
    }
}
module.exports = UserStorage;