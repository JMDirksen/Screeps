module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if(creep.memory.type == 'upgrader') run(creep);
    }
};

function run(creep) {
 
    // Check if empty/full
    if(creep.memory.upgrade && creep.isEmpty()) {
        creep.memory.upgrade = false;
    }
    if(!creep.memory.upgrade && creep.isFull()) {
        creep.memory.upgrade = true;
    }
    
    // Upgrade
    if (creep.memory.upgrade) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
            creep.goTo(creep.room.controller);
    }
    
    // Get energy
    else if(!creep.getEnergy()) {
        if(creep.store[RESOURCE_ENERGY]) creep.memory.build = true;
        creep.idle();
    }

}
