module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if (creep.memory.type == 'attacker') run(creep);
    }
};

function run(creep) {
    const spawn = Game.spawns[creep.memory.spawnRoom]
    const attackPause = spawn.memory.attackPause
    const attackRoom = spawn.memory.attackRoom
    const attackId = spawn.memory.attackId

    // Pause
    if (attackPause) return creep.idle()

    // Switch room
    if (creep.room.name != attackRoom) creep.memory.room = attackRoom
    if (creep.switchRoom()) return

    // Attack
    let target = Game.getObjectById(attackId)
    if (target) {
        creep.goTo(target, 1)
        if (creep.attack(target)) return
        if (creep.rangedAttack(target)) return
    }

    // Ranged heal other
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
