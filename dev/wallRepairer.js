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
    if (!creep.memory.job) creep.memory.job = getRepairJob(creep);

    // Get energy
    if (creep.memory.job == 'getEnergy') {
        if (creep.isFull()) creep.memory.job = getRepairJob(creep);
        else return creep.getEnergy();
    }

    // Do job
    let job = Game.getObjectById(creep.memory.job);
    let r = creep.repair(job);
    if (r == OK) {
        if (job.hits == job.hitsMax) creep.memory.job = getRepairJob(creep);
        return;
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
        creep.idle();
    }
}

function getRepairJob(creep) {
    const structures = creep.room.find(FIND_STRUCTURES, {
        filter: s =>
            s.structureType.isInList(STRUCTURE_WALL, STRUCTURE_RAMPART)
            && s.hits < s.hitsMax
    });
    const structure = _.sortByOrder(structures, ['hits', 'structureType'], ['asc', 'desc'])[0];
    if (structure) return structure.id;
    else return false;
}
