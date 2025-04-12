module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if(creep.memory.type == 'attacker') run(creep);
    }
};

function run(creep) {
    if(creep.memory.pause) {
        creep.idle();
        return;
    }

    let target = Game.getObjectById(creep.memory.attackID);
    if(!target) {
        creep.say('t?');
        creep.idle();
    }
    else if(creep.attack(target) == ERR_NOT_IN_RANGE) creep.moveTo(target);

}
