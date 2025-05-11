module.exports = function (creep) {
    // Get job
    if (!creep.memory.job) {
        creep.memory.job = getRepairJob(creep)
        if (!creep.memory.job) {
            if (!creep.isFull()) creep.memory.job = 'getEnergy'
            else return creep.idle()
        }
    }

    // Get energy
    if (creep.memory.job == 'getEnergy') {
        if (!creep.isEmpty()) creep.memory.job = getRepairJob(creep)
        else if (!creep.getEnergy()) return creep.idle()
    }

    // Do job
    let job = Game.getObjectById(creep.memory.job)
    // Build
    if (job instanceof ConstructionSite) {
        let r = creep.build(job)
        if (r == OK) creep.memory.job = false
        else if (r == ERR_NOT_IN_RANGE) creep.goTo(job, 3)
        else if (r == ERR_NOT_ENOUGH_RESOURCES) creep.memory.job = 'getEnergy', creep.getEnergy()
        else creep.memory.job = false, creep.idle()
    }
    // Repair
    else {
        let r = creep.repair(job)
        if (r == OK) {
            if (job.hits == job.hitsMax) return creep.memory.job = false
            // Run job for 10 times
            creep.memory.timer++
            if (creep.memory.timer >= 10) {
                creep.memory.timer = 0
                creep.memory.job = false
            }
        }
        else if (r == ERR_NOT_IN_RANGE) creep.goTo(job, 3)
        else if (r == ERR_NOT_ENOUGH_RESOURCES) creep.memory.job = 'getEnergy', creep.getEnergy()
        else creep.memory.job = false, creep.idle()
    }
}

function getRepairJob(creep) {
    const wallsMaxHits = creep.room.wallStrength()

    // Prioritize decaying ramparts
    const prioRamparts = creep.room.find(FIND_STRUCTURES, {
        filter: s =>
            s.structureType == STRUCTURE_RAMPART
            && s.hits <= 900
            && !creepsWithJob(creep.memory.type, s.id).length
    })
    if (prioRamparts.length) return _.sortBy(prioRamparts, 'hits')[0].id

    // Build walls
    const walls = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: s => s.structureType.isInList(STRUCTURE_WALL, STRUCTURE_RAMPART)
    })
    if (walls.length) return creep.pos.findClosestByPath(walls).id

    // All walls
    const structures = creep.room.find(FIND_STRUCTURES, {
        filter: s =>
            s.structureType.isInList(STRUCTURE_WALL, STRUCTURE_RAMPART)
            && s.hits < wallsMaxHits
            && !creepsWithJob(creep.memory.type, s.id).length
    })
    if (structures.length) {
        // Iterate 5K repair blocks
        for (i = 0; i < wallsMaxHits; i += 5000) {
            let structuresInBlock = _.filter(structures, s => s.hits >= i && s.hits < i + 5000)
            if (structuresInBlock.length) {
                let structure = creep.pos.findClosestByPath(structuresInBlock)
                //debug(creep.name + ' structure: ' + structure)
                return structure.id
            }
        }
    }

    return false
}
