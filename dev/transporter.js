module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        if (creep.memory.type == 'transporter') run(creep)
    }
};

function run(creep) {
    // Flee
    if (creep.flee()) return

    // Switch room
    if (creep.switchRoom()) return

    // Renew
    if (creep.renew()) return

    // Check if empty/full
    if (creep.memory.transport && creep.isEmpty()) {
        creep.memory.transport = false
    }
    if (!creep.memory.transport && creep.isFull()) {
        creep.memory.transport = true
    }

    // Emergency tower supply
    if (creep.room.hasDanger()) {
        const eTowers = creep.room.find(FIND_MY_STRUCTURES, {
            filter: s =>
                s.structureType == STRUCTURE_TOWER
                && s.store.getFreeCapacity(RESOURCE_ENERGY) >= 500
        })
        const eTower = _.sortBy(eTowers, t => t.store.getUsedCapacity(RESOURCE_ENERGY))[0]
        if (eTower && creep.memory.transport) {
            creep.say('❗')
            const r = creep.transfer(eTower, RESOURCE_ENERGY)
            if (r == ERR_NOT_IN_RANGE) creep.goTo(eTower, 1)
            return
        }
        if (eTower && !creep.memory.transport) {
            creep.say('❗')
            if (creep.getEnergy()) return
        }
    }

    // Spawn/Extension
    const spawn = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s =>
            s.structureType.isInList(STRUCTURE_SPAWN, STRUCTURE_EXTENSION)
            && s.store.getFreeCapacity(RESOURCE_ENERGY)
    })
    if (spawn && creep.memory.transport) {
        const r = creep.transfer(spawn, RESOURCE_ENERGY)
        if (r == ERR_NOT_IN_RANGE) creep.goTo(spawn, 1)
        return
    }
    if (spawn && !creep.memory.transport) {
        if (creep.getEnergy()) return;
    }

    // Tower
    const towers = creep.room.find(FIND_MY_STRUCTURES, {
        filter: s =>
            s.structureType == STRUCTURE_TOWER
            && s.store.getFreeCapacity(RESOURCE_ENERGY)
    })
    const tower = _.sortBy(towers, t => t.store.getUsedCapacity(RESOURCE_ENERGY))[0]
    if (tower && creep.memory.transport) {
        const r = creep.transfer(tower, RESOURCE_ENERGY)
        if (r == ERR_NOT_IN_RANGE) creep.goTo(tower, 1)
        return
    }
    if (tower && !creep.memory.transport) {
        if (creep.getEnergy()) return
    }

    // Storage
    const storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s =>
            s.structureType == STRUCTURE_STORAGE
            && s.store.getFreeCapacity(RESOURCE_ENERGY)
    })
    if (storage && creep.memory.transport) {
        const r = creep.transfer(storage, RESOURCE_ENERGY)
        if (r == ERR_NOT_IN_RANGE) creep.goTo(storage, 1)
        return
    }
    if (storage && !creep.memory.transport) {
        if (creep.getEnergy({ fromStorage: false, structureMinPercentFull: 50 })) return
    }

    // Get energy before idling
    if (!creep.isFull()) {
        if (creep.getEnergy({ fromStorage: false })) return
    }

    // Idle
    creep.idle()

}
