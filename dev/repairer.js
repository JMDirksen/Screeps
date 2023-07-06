module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if(creep.memory.type == 'repairer') run(creep);
    }
};

function run(creep) {
    // Switch room
    if(creep.switchRoom()) {
        return;
    }
    
    // Get job
    if (!creep.memory.job) creep.memory.job = getRepairJob(creep);
    
    // Get energy
    if (creep.memory.job == 'getEnergy') {
        if (creep.isFull()) creep.memory.job = getRepairJob(creep);
        else creep.getEnergy();
    }

    // Do job
    let job = Game.getObjectById(creep.memory.job);
    let r = creep.repair(job);
    if (r == OK) {
        if (job.hits == job.hitsMax) creep.memory.job = getRepairJob(creep);
        return;
    }
    else if (r == ERR_NOT_IN_RANGE) creep.goTo(job);
    else if (r == ERR_NOT_ENOUGH_RESOURCES) {
        creep.memory.job = 'getEnergy';
        creep.getEnergy();
        return;
    }
    else {
        creep.say('?');
        creep.memory.job = getRepairJob(creep);
    }
}

function getRepairJob(creep) {
	const structures = creep.room.find(FIND_STRUCTURES, {
		filter: s =>
			s.structureType.isInList(STRUCTURE_ROAD, STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK, STRUCTURE_TOWER, STRUCTURE_WALL, STRUCTURE_RAMPART)
			&& s.hits < s.hitsMax
	});
	const structure = _.sortBy(structures, 'hits')[0];
    if(structure) return structure.id;
    else return false;
}
