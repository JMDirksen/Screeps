'use strict'

module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if (creep.memory.type == 'attacker') run(creep);
    }
};

function run(creep) {
    if (creep.spawning) return
    const spawn = Game.rooms[creep.memory.spawnRoom].spawn()
    const attackPause = spawn.memory.attackPause
    const attackRoom = spawn.memory.attackRoom
    const attackId = spawn.memory.attackId

    // Pause
    if (attackPause) return creep.idle()

    // Switch room
    if (creep.room.name != attackRoom) creep.memory.room = attackRoom
    if (creep.switchRoom()) return

    // Attack id
    let target = Game.getObjectById(attackId)
    if (target) {
        creep.goTo(target, 3)
        if (creep.rangedAttack(target) && Game.time % 2) return
    }

    // Attack hostiles
    else {
        // Lowest hits or closest hostile
        let target = _.sortByAll(creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: c => c.countParts([ATTACK, RANGED_ATTACK, HEAL])
        }), c => c.hits, c => c.pos.getRangeTo(creep.pos))[0]
        if (target) {
            creep.goTo(target, 3)
            if (creep.rangedAttack(target) && Game.time % 2) return
        }
    }

    // Ranged heal other
    let healCreep
    if (healCreep = creep.pos.findInRange(FIND_MY_CREEPS, 3, { filter: c => c.hits < c.hitsMax })[0]) {
        creep.rangedHeal(healCreep)
    }

    // Heal other
    if (healCreep = creep.pos.findInRange(FIND_MY_CREEPS, 1, { filter: c => c.hits < c.hitsMax })[0]) {
        creep.heal(healCreep)
    }

    // Self heal
    if (creep.hits < creep.hitsMax) creep.heal(creep)

}
