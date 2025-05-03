'use strict'

module.exports = function (creep) {
    // Get job
    if (!creep.memory.job) {
        creep.memory.job = getRepairJob(creep)
        if (!creep.memory.job && !creep.isFull()) creep.memory.job = 'getEnergy'
        if (!creep.memory.job) return creep.idle()
    }

    // Get energy
    if (creep.memory.job == 'getEnergy') {
        if (creep.isFull()) creep.memory.job = getRepairJob(creep)
        else if (creep.getEnergy()) return
        else return creep.idle()
    }

    // Do job
    let job = Game.getObjectById(creep.memory.job)
    let r = creep.repair(job)
    if (r == OK) {
        if (job.hits == job.hitsMax) creep.memory.job = getRepairJob(creep)
    }
    else if (r == ERR_NOT_IN_RANGE) {
        creep.goTo(job, 3)
    }
    else if (r == ERR_NOT_ENOUGH_RESOURCES) {
        creep.memory.job = 'getEnergy'
        creep.getEnergy()
    }
    else {
        creep.memory.job = false
        creep.idle()
    }
}

function getRepairJob(creep) {
    const structures = creep.room.find(FIND_STRUCTURES, {
        filter: s =>
            s.structureType.isInList(STRUCTURE_ROAD, STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK, STRUCTURE_TOWER)
            && s.hits < s.hitsMax
    })
    //debug(`${creep.name} ${structures.length} structures to repair`)
    const structure = creep.pos.findClosestByPath(structures)
    if (structure) return structure.id
    else return false
}
