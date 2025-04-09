module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if(creep.memory.type == 'claimer') run(creep);
    }
};

function run(creep) {
    // Switch room
    if(creep.switchRoom()) {
        return;
    }

    // Claim
    const controller = creep.room.controller;
    if(controller) {
        if (creep.claimController(controller) == ERR_NOT_IN_RANGE) creep.goTo(controller);
        else {
            creep.idle();
        }
    }
    else {
        creep.idle();
    }
}
