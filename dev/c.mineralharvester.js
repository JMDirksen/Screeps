'use strict'

module.exports = function (creep) {
    // Check if empty/full
    if (!creep.memory.harvest && creep.isEmpty()) {
        creep.memory.harvest = true
    }
    if (creep.memory.harvest && creep.isFull()) {
        creep.memory.harvest = false
    }

    // Mineral harvest
    if (creep.memory.harvest) {
        const extractor = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTRACTOR }
        })
        if (!extractor) return creep.idle({ inPlace: true })
        const mineral = extractor.pos.lookFor(LOOK_MINERALS)[0]
        const r = creep.harvest(mineral)
        if (r == ERR_NOT_IN_RANGE && creep.goTo(mineral, 1)) return
        else if (r == ERR_TIRED) return
        else if (r == ERR_INVALID_TARGET) creep.memory.harvest = false
        else if (r == OK) return
        else if (r == ERR_NOT_ENOUGH_RESOURCES) return creep.idle()
        else creep.say(r)
    }

    // Deliver
    else {
        const storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s =>
                s.structureType.isInList(STRUCTURE_STORAGE)
        })
        if (storage) {
            const resource = Object.keys(creep.store)[0]
            const r = creep.transfer(storage, resource)
            if (r == ERR_NOT_IN_RANGE) creep.goTo(storage, 1)
            return
        }

        // Idle
        else {
            creep.idle({ inPlace: true })
        }
    }

}
