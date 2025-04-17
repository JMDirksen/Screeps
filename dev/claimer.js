module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if (creep.memory.type == 'claimer') run(creep);
    }
};

function run(creep) {
    // Switch room
    if (creep.switchRoom()) {
        return;
    }

    // Claim
    if (creep.getActiveBodyparts(CLAIM)) {
        const controller = creep.room.controller;
        if (controller && !controller.my) {
            if (creep.claimController(controller) == ERR_NOT_IN_RANGE) {
                creep.goTo(controller, 1);
                return;
            }
        }
    }

    // Harvest
    if (creep.isEmpty()) creep.memory.harvest = true;
    if (creep.isFull()) creep.memory.harvest = false;
    if (creep.memory.harvest) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) creep.goTo(source, 1);
        return;
    }

    // Build spawn
    const spawnSite = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: { structureType: STRUCTURE_SPAWN }
    })[0];
    if (spawnSite) {
        if (creep.build(spawnSite) == ERR_NOT_IN_RANGE) creep.goTo(spawnSite, 3);
        return;
    }

    // Supply spawn
    const spawn = creep.room.find(FIND_MY_SPAWNS, { filter: s => s.store.getFreeCapacity(RESOURCE_ENERGY) })[0];
    if (spawn) {
        if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.goTo(spawn, 1);
        return;
    }

    // Upgrade controller
    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) creep.goTo(creep.room.controller, 3);

}
