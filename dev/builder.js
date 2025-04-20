module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        if (creep.memory.type == 'builder') run(creep)
    }
}

function run(creep) {
    // Flee
    if (creep.flee()) return

    // Switch room
    if (creep.switchRoom()) {
        return
    }

    // Check if empty/full
    if (creep.memory.build && creep.isEmpty()) {
        creep.memory.build = false
    }
    if (!creep.memory.build && creep.isFull()) {
        creep.memory.build = true
    }

    // Build
    if (creep.memory.build) {
        const sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES)
        if (!sites.length) return creep.idle()
        const site = _.sortByOrder(sites, ['progress'], ['desc'])[0]
        if (site) {
            if (creep.build(site) == ERR_NOT_IN_RANGE) creep.goTo(site, 3)
        }
        else {
            creep.idle()
        }
    }

    // Get energy
    else if (!creep.getEnergy()) {
        if (creep.store[RESOURCE_ENERGY]) creep.memory.build = true
        creep.idle()
    }
}
