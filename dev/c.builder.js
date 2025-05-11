'use strict'

module.exports = function (creep) {
    // Check if empty/full
    if (creep.memory.build && creep.isEmpty()) {
        creep.memory.build = false
    }
    if (!creep.memory.build && !creep.isEmpty()) {
        creep.memory.build = true
    }

    // Build
    if (creep.memory.build) {
        let sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: s => !s.structureType.isInList(STRUCTURE_WALL, STRUCTURE_RAMPART)
        })
        if (!sites.length) return creep.idle()
        sites = _.sortBy(sites, s => s.pos.getRangeTo(creep.pos))
        const site = _.sortByOrder(sites, ['progress'], ['desc'])[0]
        if (site) {
            if (creep.build(site) == ERR_NOT_IN_RANGE) creep.goTo(site, 3)
        }
        else {
            creep.idle({ inPlace: true })
        }
    }

    // Get energy
    else if (!creep.getEnergy()) {
        creep.idle({ inPlace: true })
    }
}
