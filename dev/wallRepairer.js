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
        // Run job for 5 times
        creep.memory.timer++
        if (creep.memory.timer >= 5) {
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
    const prioRamparts = creep.room.find(FIND_STRUCTURES, {
        filter: s =>
            s.structureType == STRUCTURE_RAMPART
            && s.hits <= 900
    })
    if (prioRamparts.length) return _.sortBy(prioRamparts, 'hits')[0].id

    const structures = creep.room.find(FIND_STRUCTURES, {
        filter: s =>
            s.structureType.isInList(STRUCTURE_WALL, STRUCTURE_RAMPART)
            && s.hits < s.hitsMax
    })
    if (structures.length) return _.sortByOrder(structures, ['hits', 'structureType'], ['asc', 'desc'])[0].id

    return false
}
