module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        if (creep.memory.type == 'guardHealer') run(creep)
    }
}

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

    // Idle
    if (!creep.room.countCreeps('guard')) creep.idle({ flagColor: COLOR_RED })

    // Move in range of closest guard
    const closestGuard = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
        filter: c => c.memory.type == 'guard'
    })
    if (closestGuard && creep.pos.getRangeTo(closestGuard) > 1) creep.goTo(closestGuard, 1)

    // Heal lowest hits guard    
    const lowGuard = _.sortBy(creep.room.find(FIND_MY_CREEPS, {
        filter: c => c.memory.type == 'guard'
            && c.hits < c.hitsMax
    }), 'hits')[0]
    if (lowGuard) {
        const range = creep.pos.getRangeTo(lowGuard)
        if (range == 1) creep.heal(lowGuard)
        else if (range <= 3) creep.rangedHeal(lowGuard)
        if (range > 1) creep.goTo(lowGuard, 1)
    }

    // Heal self
    if (creep.hits < creep.hitsMax) creep.heal(creep)

}
