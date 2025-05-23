'use strict'

module.exports = function (creep) {
    // Check if empty/full
    if (!creep.memory.harvest && creep.isEmpty()) {
        creep.memory.harvest = true
    }
    if (creep.memory.harvest && creep.isFull()) {
        creep.memory.harvest = false
    }

    // Harvest in remote room
    if (creep.memory.harvest) {

        // Switch room
        if (creep.room.name != creep.memory.remoteRoom) {
            creep.memory.room = creep.memory.remoteRoom
            return creep.switchRoom()
        }

        if (creep.getEnergy()) return
        else {
            const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
            if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) creep.goTo(source, 1)
        }
    }

    // Deliver to source room
    else {

        // Switch room
        if (creep.room.name != creep.memory.spawnRoom) {
            creep.memory.room = creep.memory.spawnRoom
            return creep.switchRoom()
        }

        const storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s =>
                s.structureType.isInList(STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK)
                && s.store.getFreeCapacity(RESOURCE_ENERGY)
        })
        if (storage) {
            if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.goTo(storage, 1)
        }
        else {
            creep.idle()
        }

    }
}
