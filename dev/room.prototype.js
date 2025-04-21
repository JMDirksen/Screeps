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

Room.prototype.storedEnergy = function (includeDropped = false) {
    let storageStructures = this.find(FIND_STRUCTURES, {
        filter: s =>
            s.structureType.isInList(STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK)
    })
    let storedEnergy = _.sum(storageStructures, s => s.store[RESOURCE_ENERGY])
    if (!includeDropped) return storedEnergy
    let droppedEnergy = this.find(FIND_DROPPED_RESOURCES, { filter: r => r.resourceType == RESOURCE_ENERGY })
    return storedEnergy + droppedEnergy
}

Room.prototype.availableStorage = function (type = RESOURCE_ENERGY) {
    let storageStructures = this.find(FIND_STRUCTURES, {
        filter: s =>
            s.structureType.isInList(STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK)
    })
    return _.sum(storageStructures, s => s.store.getFreeCapacity(type))
}

Room.prototype.hasDanger = function () {
    return this.find(FIND_HOSTILE_CREEPS, {
        filter: c => c.countActiveParts([ATTACK, RANGED_ATTACK])
    }).length > 0
}

Room.prototype.spawn = function () {
    return this.find(FIND_MY_SPAWNS)[0]
}
