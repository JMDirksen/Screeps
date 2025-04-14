Room.prototype.countCreeps = function (type) {
    return this.find(FIND_MY_CREEPS, {
        filter: c => c.memory.type == type
    }).length;
}

Room.prototype.energyProduction = function () {
    let sources = this.find(FIND_SOURCES);
    return _.sum(sources, 'energyCapacity') / 300;
}
