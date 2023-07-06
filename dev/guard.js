module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if(creep.memory.type == 'guard') run(creep);
    }
};

function run(creep) {
    // Switch room
    if(creep.switchRoom()) {
        return;
    }

    const target = creep.pos.findClosestByRange(creep.room.find(FIND_MY_SPAWNS)[0].pos.findInRange(FIND_HOSTILE_CREEPS, 15));
    if(target) {
        if (creep.attack(target) == ERR_NOT_IN_RANGE) creep.goTo(target);
    }
    else {
        creep.idle();
    }

}
