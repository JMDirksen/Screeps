Room.prototype.countCreeps = function (type) {
    return this.find(FIND_MY_CREEPS, {
        filter: c => c.memory.type == type
    }).length;
}

Room.prototype.energyProduction = function () {
    let sources = this.find(FIND_SOURCES);
    return _.sum(sources, 'energyCapacity') / 300;
}

Room.prototype.sourceSpots = function () {
    let sources = this.find(FIND_SOURCES)
    let countAccessible = 0
    for (const source of sources) {
        let spots = [
            new RoomPosition(source.pos.x, source.pos.y - 1, this.name),
            new RoomPosition(source.pos.x + 1, source.pos.y - 1, this.name),
            new RoomPosition(source.pos.x + 1, source.pos.y, this.name),
            new RoomPosition(source.pos.x + 1, source.pos.y + 1, this.name),
            new RoomPosition(source.pos.x, source.pos.y + 1, this.name),
            new RoomPosition(source.pos.x - 1, source.pos.y + 1, this.name),
            new RoomPosition(source.pos.x - 1, source.pos.y, this.name),
            new RoomPosition(source.pos.x - 1, source.pos.y - 1, this.name)
        ]
        for (const spot of spots) {
            if (spot.lookFor(LOOK_TERRAIN) == 'plain' || spot.lookFor(LOOK_TERRAIN) == 'swamp') countAccessible++
        }
    }
    return countAccessible
}
