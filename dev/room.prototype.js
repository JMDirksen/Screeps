Room.prototype.countCreeps = function (type) {
    return this.find(FIND_MY_CREEPS, {
        filter: c => c.memory.type == type
    }).length;
}