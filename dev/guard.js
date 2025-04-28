'use strict'

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

    // Renew
    if (creep.renew()) return

    // Get weakest hostile in guardBounds
    const room = creep.room
    const guardBounds = room.spawn().memory.guardBounds
    const target = _.sortBy(room.findInBounds(FIND_HOSTILE_CREEPS, guardBounds, {
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
        if (range <= 3) {
            let hostilesInRange = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3)
            if (hostilesInRange > 1) creep.rangedMassAttack()
            else creep.rangedAttack(target)
        }
        // Boast
        else creep.rangedMassAttack()

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
        let healCreep
        
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

        // Boast
        if (room.find(FIND_HOSTILE_CREEPS).length) creep.rangedMassAttack()

        // Idle
        creep.idle({ flagColor: COLOR_RED })
    }

}
