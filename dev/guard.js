module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if (creep.memory.type == 'guard') run(creep);
    }
};

function run(creep) {
    // Switch room
    if (creep.switchRoom()) {
        return;
    }

    const spawn = creep.room.spawn()

    // Get target
    let target = null
    if (spawn) {
        const targets = spawn.pos.findInRange(FIND_HOSTILE_CREEPS, spawn.memory.guardRange)
        target = creep.pos.findClosestByPath(targets)
    }
    else {
        target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
    }

    // Attack
    if (target) {
        const range = creep.pos.getRangeTo(target)
        // Move
        if (range > 1) creep.goTo(target, 1)
        // Attack
        if (range == 1) creep.attack(target)
        // Ranged attack
        if (range <= 3) creep.rangedAttack(target)
    }

    // Idle
    else {
        creep.idle()
    }

}
