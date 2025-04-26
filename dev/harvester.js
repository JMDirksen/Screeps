module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        if (creep.memory.type == 'harvester') run(creep)
    }
}

function run(creep) {
    // Flee
    if (creep.flee()) return

    // Switch room
    if (creep.switchRoom()) return

    // Renew
    if (creep.renew()) return

    // Check if empty/full
    if (!creep.memory.harvest && creep.isEmpty()) {
        creep.memory.harvest = true
    }
    if (creep.memory.harvest && creep.isFull()) {
        creep.memory.harvest = false
    }

    // Harvest
    if (creep.memory.harvest) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
        if (!source && creep.isEmpty()) creep.idle({ inPlace: true })
        const r = creep.harvest(source)
        if (r == ERR_NOT_IN_RANGE) creep.goTo(source, 1)
        else if (r == ERR_INVALID_TARGET) creep.memory.harvest = false
    }

    // Deliver
    else {

        // Spawn/Extension
        if (!creep.room.countCreeps('transporter')) {
            const storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: s =>
                    s.structureType.isInList(STRUCTURE_SPAWN, STRUCTURE_EXTENSION)
                    && s.store.getFreeCapacity(RESOURCE_ENERGY)
            })
            if (storage) {
                const r = creep.transfer(storage, RESOURCE_ENERGY)
                if (r == ERR_NOT_IN_RANGE) creep.goTo(storage, 1)
                return
            }

            // Idle
            else {
                creep.idle({ inPlace: true })
            }
        }

        // Container/Storage/Link
        else {
            const storage2 = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s =>
                    s.structureType.isInList(STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK)
                    && s.store.getFreeCapacity(RESOURCE_ENERGY)
            })
            if (storage2) {
                const r = creep.transfer(storage2, RESOURCE_ENERGY)
                if (r == ERR_NOT_IN_RANGE) creep.goTo(storage2, 1)
                return
            }

            // Idle (when there is a storage structure)
            else if (creep.room.find(FIND_STRUCTURES, {
                filter: s => s.structureType.isInList(STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK)
            }).length) creep.idle({ inPlace: true })

            // Drop
            else {
                creep.drop(RESOURCE_ENERGY)
            }
        }

    }

}
