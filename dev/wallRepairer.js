module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if (creep.memory.type == 'wallRepairer') run(creep);
    }
};

function run(creep) {
    // Switch room
    if (creep.switchRoom()) {
        return;
    }

    // Get job
    if (!creep.memory.job) {
        creep.memory.job = getRepairJob(creep)
        if (!creep.memory.job) return creep.idle()
    }

    // Get energy
    if (creep.memory.job == 'getEnergy') {
        if (creep.isFull()) creep.memory.job = getRepairJob(creep);
        else return creep.getEnergy();
    }

    // Do job
    let job = Game.getObjectById(creep.memory.job);
    let r = creep.repair(job);
    if (r == OK) {
        if (job.hits == job.hitsMax) creep.memory.job = getRepairJob(creep)
        // Run job for 10 times
        creep.memory.timer++
        if (creep.memory.timer >= 10) {
            creep.memory.timer = 0
            creep.memory.job = getRepairJob(creep)
        }
        return
    }
    else if (r == ERR_NOT_IN_RANGE) {
        creep.goTo(job, 3);
        return;
    }
    else if (r == ERR_NOT_ENOUGH_RESOURCES) {
        creep.memory.job = 'getEnergy';
        creep.getEnergy();
        return;
    }
    else {
        creep.memory.job = false
        creep.idle()
    }
}

function getRepairJob(creep) {
    // Prioritize decaying ramparts
    const prioRamparts = creep.room.find(FIND_STRUCTURES, {
        filter: s =>
            s.structureType == STRUCTURE_RAMPART
            && s.hits <= 900
            && !creepsWithJob(creep.memory.type, s.id).length
    })
    if (prioRamparts.length) return _.sortBy(prioRamparts, 'hits')[0].id

    // All walls
    const structures = creep.room.find(FIND_STRUCTURES, {
        filter: s =>
            s.structureType.isInList(STRUCTURE_WALL, STRUCTURE_RAMPART)
            && s.hits < s.hitsMax
            && !creepsWithJob(creep.memory.type, s.id).length
    })
    if (structures.length) {
        // Iterate 5K repair blocks
        for (i = 0; i < 3000000; i += 5000) {
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
