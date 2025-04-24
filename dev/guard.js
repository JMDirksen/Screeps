module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if (creep.memory.type == 'guard') run(creep);
    }
};

function run(creep) {
    // Back to guard room
    if (creep.room.name != creep.memory.guardRoom) {
        creep.memory.room = creep.memory.guardRoom
        creep.say('🔙')
        info('🔙 ' + creep.room.name + ' ' + creep.name + ' going back to guard room')
    }

    // Switch room
    if (creep.switchRoom()) return

    // Get weakest nearby hostile
    let guardRange = creep.room.spawn().memory.guardRange
    let target = _.sortBy(creep.pos.findInRange(FIND_HOSTILE_CREEPS, guardRange, {
        filter: c => c.countParts([ATTACK, RANGED_ATTACK, HEAL])
    }), 'hits')[0]

    // Attack
    if (target) {
        const range = creep.pos.getRangeTo(target)
        // Move
        if (range > 1) creep.goTo(target, 1)
        // Attack
        if (range == 1) creep.attack(target)
        // Ranged attack
        if (range <= 3) creep.rangedAttack(target)

        // Heal self
        if (range > 1 && creep.hits < creep.hitsMax) creep.heal(creep)
        // Heal other
        else if (range > 1 && (healCreep = creep.pos.findInRange(FIND_MY_CREEPS, 1, { filter: c => c.hits < c.hitsMax })[0])) {
            creep.heal(healCreep)
        }
        // Ranged heal other
        if (range > 3 && (healCreep = creep.pos.findInRange(FIND_MY_CREEPS, 3, { filter: c => c.hits < c.hitsMax })[0])) {
            creep.rangedHeal(healCreep)
        }
    }

    else {
        // Heal self
        if (creep.hits < creep.hitsMax) creep.heal(creep)

        // Heal other
        else if (healCreep = creep.pos.findInRange(FIND_MY_CREEPS, 1, { filter: c => c.hits < c.hitsMax })[0]) {
            creep.heal(healCreep)
        }

        // Ranged heal other
        if (healCreep = creep.pos.findInRange(FIND_MY_CREEPS, 3, { filter: c => c.hits < c.hitsMax })[0]) {
            creep.rangedHeal(healCreep)
        }

        // Idle
        creep.idle(COLOR_RED)
    }

}
