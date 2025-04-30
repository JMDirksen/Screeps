'use strict'

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

Room.prototype.getFreeCapacity = function (type = RESOURCE_ENERGY) {
    let storageStructures = this.find(FIND_STRUCTURES, {
        filter: s =>
            s.structureType.isInList(STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK)
    })
    return _.sum(storageStructures, s => s.store.getFreeCapacity(type))
}

Room.prototype.getUsedCapacity = function (type = RESOURCE_ENERGY, includeDropped = false) {
    let storageStructures = this.find(FIND_STRUCTURES, {
        filter: s =>
            s.structureType.isInList(STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK)
    })
    let storedEnergy = _.sum(storageStructures, s => s.store.getUsedCapacity(type))
    if (!includeDropped) return storedEnergy
    let droppedEnergy = this.find(FIND_DROPPED_RESOURCES, { filter: r => r.resourceType == RESOURCE_ENERGY })
    return storedEnergy + droppedEnergy
}

Room.prototype.getCapacity = function (type = RESOURCE_ENERGY) {
    let storageStructures = this.find(FIND_STRUCTURES, {
        filter: s =>
            s.structureType.isInList(STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK)
    })
    return _.sum(storageStructures, s => s.store.getCapacity(type))
}

Room.prototype.getUsedCapacityPercentage = function (type = RESOURCE_ENERGY) {
    return Math.round(this.getUsedCapacity(type) / Math.max(this.getCapacity(type), 1) * 100)
}

Room.prototype.hasDanger = function () {
    return this.find(FIND_HOSTILE_CREEPS, {
        filter: c => c.countActiveParts([ATTACK, RANGED_ATTACK])
    }).length > 0
}

Room.prototype.spawn = function () {
    return this.find(FIND_MY_SPAWNS)[0]
}

Room.prototype.findInBounds = function (type, bounds, opts = {}) {
    // Bounds: [{ x: 0, y: 0 }, { x: 49, y: 49 }]
    const foundInRoom = this.find(type, opts)
    return _.filter(foundInRoom, o =>
        o.pos.x >= bounds[0].x
        && o.pos.y >= bounds[0].y
        && o.pos.x <= bounds[1].x
        && o.pos.y <= bounds[1].y
    )
}

Room.prototype.getFlagBounds = function (flagColor) {
    const flags = this.find(FIND_FLAGS, { filter: f => f.color == flagColor })
    if (flags.length < 2) return null
    const flag1 = _.sortByOrder(flags, ['pos.x', 'pos.y'], ['asc', 'asc'])[0]
    const flag2 = _.sortByOrder(flags, ['pos.x', 'pos.y'], ['desc', 'desc'])[0]
    return [{ x: flag1.pos.x, y: flag1.pos.y }, { x: flag2.pos.x, y: flag2.pos.y }]
}

Room.prototype.linksUsedPercentage = function () {
    let links = this.find(FIND_MY_STRUCTURES, {
        filter: s => s.structureType == STRUCTURE_LINK
    })
    if (!links.length) return false
    let used = _.sum(links, s => s.store.getUsedCapacity(RESOURCE_ENERGY))
    let total = _.sum(links, s => s.store.getCapacity(RESOURCE_ENERGY))
    return Math.round(used / total * 100)
}
